import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import * as db from "./db";

function digest(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest();
}

export function isBetaAccessKeyValid(
  candidate: string,
  configuredKey = process.env.BETA_ACCESS_KEY ?? ""
) {
  if (!candidate || !configuredKey) return false;
  return crypto.timingSafeEqual(digest(candidate), digest(configuredKey));
}

export function isBetaEmailAllowed(
  email: string,
  configuredEmails = process.env.BETA_ALLOWED_EMAILS ?? ""
) {
  const allowlist = configuredEmails
    .split(/[;,\n]/)
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowlist.length === 0) return true;
  return allowlist.includes(email.trim().toLowerCase());
}

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => ctx.user || null),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie(COOKIE_NAME, {
        ...getSessionCookieOptions(ctx.req),
        maxAge: -1,
      });
    }
    return { success: true };
  }),
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async () => ({
      success: false,
      reason: "password_login_not_configured" as const,
      authentication: "beta_access_or_oauth_session" as const,
    })),
  betaAccess: publicProcedure
    .input(
      z.object({
        email: z.string().email().max(320),
        accessKey: z.string().min(1).max(512),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const configuredKey = process.env.BETA_ACCESS_KEY ?? "";
      if (!configuredKey) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Beta access is not configured.",
        });
      }

      const email = input.email.trim().toLowerCase();
      if (
        !isBetaAccessKeyValid(input.accessKey, configuredKey) ||
        !isBetaEmailAllowed(email)
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid beta access credentials.",
        });
      }

      const openId = `beta:${email}`;
      await db.upsertUser({
        openId,
        email,
        name: email.split("@")[0] || "Beta Tester",
        loginMethod: "beta_access",
        lastSignedIn: new Date(),
      });

      const user = await db.getUserByOpenId(openId);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create beta session.",
        });
      }

      const sessionToken = await sdk.createSessionToken(openId, {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...getSessionCookieOptions(ctx.req),
        maxAge: ONE_YEAR_MS,
      });

      return {
        success: true,
        authentication: "beta_access_session" as const,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }),
});
