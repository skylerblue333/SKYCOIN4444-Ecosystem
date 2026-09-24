import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { COOKIE_NAME } from "../shared/const";

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => ctx.user || null),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie(COOKIE_NAME, {
        maxAge: -1,
        secure: true,
        sameSite: "none",
        httpOnly: true,
        path: "/",
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
