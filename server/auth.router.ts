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
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async () => ({
      success: false,
      reason: "password_login_not_configured" as const,
      authentication: "oauth_session" as const,
    })),
});
