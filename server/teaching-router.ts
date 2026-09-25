import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

const notConfigured = (resource: string): never => {
  throw new TRPCError({ code: "PRECONDITION_FAILED", message: `${resource} requires a configured persistent repository` });
};

export const teachingRouter = router({
  getTeachers: publicProcedure.input(z.object({ language: z.string().optional(), minRating: z.number().optional(), maxRate: z.number().optional(), limit: z.number().default(20), offset: z.number().default(0) })).query(async ({ input }) => ({ teachers: [], total: 0, limit: input.limit, offset: input.offset, status: "not_configured" as const })),
  getTeacherProfile: publicProcedure.input(z.object({ teacherId: z.string() })).query(async () => { throw new TRPCError({ code: "NOT_FOUND", message: "Teacher profiles are not configured yet" }); }),
  bookSession: protectedProcedure.input(z.object({ teacherId: z.string(), startTime: z.date(), duration: z.number().positive(), topic: z.string().min(1).max(200), notes: z.string().max(2000).optional() })).mutation(async () => notConfigured("Teaching bookings")),
  createTeacherProfile: protectedProcedure.input(z.object({ language: z.string().min(1), proficiency: z.enum(["Native", "Fluent", "Advanced", "Intermediate"]), hourlyRate: z.number().min(5).max(500), bio: z.string().max(1000), specialties: z.array(z.string()).max(10), certifications: z.array(z.string()).optional(), availability: z.string() })).mutation(async () => notConfigured("Teacher profiles")),
  getMyProfile: protectedProcedure.query(async ({ ctx }) => ({ userId: ctx.user.id, isTeacher: false, profile: null, status: "not_configured" as const })),
  getMyBookings: protectedProcedure.input(z.object({ type: z.enum(["student", "teacher"]).optional(), status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional() })).query(async () => ({ bookings: [], total: 0, status: "not_configured" as const })),
  getEarnings: protectedProcedure.input(z.object({ period: z.enum(["week", "month", "year", "all"]).default("month") })).query(async () => ({ totalEarnings: 0, thisMonth: 0, pending: 0, history: [], status: "not_configured" as const })),
  leaveReview: protectedProcedure.input(z.object({ teacherId: z.string(), bookingId: z.string(), rating: z.number().min(1).max(5), comment: z.string().min(1).max(500) })).mutation(async () => notConfigured("Teacher reviews")),
  getTeacherReviews: publicProcedure.input(z.object({ teacherId: z.string(), limit: z.number().default(10), offset: z.number().default(0) })).query(async () => ({ reviews: [], total: 0, averageRating: 0, status: "not_configured" as const })),
  searchTeachers: publicProcedure.input(z.object({ query: z.string(), language: z.string().optional(), minRating: z.number().optional(), maxRate: z.number().optional() })).query(async () => ({ results: [], total: 0, status: "not_configured" as const })),
});

export default teachingRouter;
