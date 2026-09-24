import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import {
  betaAccessKeyIssue,
  betaAccessOpenId,
  betaAuthMode,
  normalizeBetaEmail,
  verifyBetaAccessKey,
} from "./_core/betaAccessAuth";
import { evaluateBetaAdmission } from "./_core/betaAdmission";
import * as db from "./db";

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
        email: z.string().min(1).max(320),
        accessKey: z.string().min(1).max(512),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const configurationIssue = betaAccessKeyIssue();
      if (betaAuthMode() !== "access_key" || configurationIssue) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Beta access is not configured.",
        });
      }

      const email = normalizeBetaEmail(input.email);
      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A valid email is required.",
        });
      }

      const openId = betaAccessOpenId(email);
      const admission = evaluateBetaAdmission({ openId, email });
      const keyValid = verifyBetaAccessKey(input.accessKey);

      // Keep invite membership and credential validity indistinguishable.
      if (!admission.allowed || !keyValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid beta access credentials.",
        });
      }

      const upserted = await db.upsertUser({
        openId,
        email,
        name: "Invited Beta Tester",
        loginMethod: "beta_access",
        lastSignedIn: new Date(),
      });

      const user = upserted ?? (await db.getUserByOpenId(openId));
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create beta session.",
        });
      }

      const sessionToken = await sdk.createSessionToken(openId, {
        name: user.name || "Invited Beta Tester",
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
