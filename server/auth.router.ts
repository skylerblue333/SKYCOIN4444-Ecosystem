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
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => ({
      success: true,
    })),
});
