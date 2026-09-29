import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getPublicCourse,
  gradeCourseQuiz,
  listCourseSummaries,
} from "./education-core";

export const educationRouter = router({
  catalog: publicProcedure.query(() => listCourseSummaries()),
  course: publicProcedure
    .input(z.object({ courseId: z.string().min(1).max(128) }))
    .query(({ input }) => getPublicCourse(input.courseId)),
  gradeQuiz: publicProcedure
    .input(
      z.object({
        courseId: z.string().min(1).max(128),
        answers: z
          .array(
            z.object({
              questionId: z.string().min(1).max(128),
              optionIndex: z.number().int().min(0).max(20),
            })
          )
          .max(50),
      })
    )
    .mutation(({ input }) => gradeCourseQuiz(input.courseId, input.answers)),
  capability: publicProcedure.query(() => ({
    curriculum: "available" as const,
    quizGrading: "available" as const,
    serverProgressPersistence: "not_configured" as const,
    certificates: "not_configured" as const,
    tokenRewards: "not_configured" as const,
  })),
});
