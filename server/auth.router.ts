import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

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
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async () => {
      // The beta's real session path is the OAuth callback, which persists
      // the user and sets a signed session cookie. Never report a successful
      // email/password login until durable password credentials exist.
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message:
          "Email/password login is not enabled. Use the configured OAuth sign-in flow.",
      });
    }),
});
