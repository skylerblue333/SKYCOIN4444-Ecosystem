import { describe, expect, it } from "vitest";
import {
  getPublicCourse,
  gradeCourseQuiz,
  listCourseSummaries,
} from "./education-core";

describe("education core", () => {
  it("publishes a deterministic catalog with unique course ids", () => {
    const catalog = listCourseSummaries();
    expect(catalog.length).toBeGreaterThanOrEqual(4);
    expect(new Set(catalog.map(course => course.id)).size).toBe(catalog.length);
    expect(catalog.every(course => course.lessonCount >= 3)).toBe(true);
    expect(catalog.every(course => course.quizQuestions >= 5)).toBe(true);
  });

  it("does not expose answer keys in the public course payload", () => {
    const course = getPublicCourse("hopeai-literacy");
    expect(course).not.toBeNull();
    expect(course?.quiz.questions.length).toBeGreaterThan(0);
    expect(JSON.stringify(course)).not.toContain("correctIndex");
    expect(JSON.stringify(course)).not.toContain("explanation");
  });

  it("grades quizzes deterministically and returns explanations after submission", () => {
    const grade = gradeCourseQuiz("software-engineering-beta", [
      { questionId: "se-q1", optionIndex: 1 },
      { questionId: "se-q2", optionIndex: 1 },
      { questionId: "se-q3", optionIndex: 1 },
      { questionId: "se-q4", optionIndex: 2 },
      { questionId: "se-q5", optionIndex: 1 },
    ]);

    expect(grade).toMatchObject({
      courseId: "software-engineering-beta",
      score: 100,
      passed: true,
      correct: 5,
      total: 5,
    });
    expect(grade?.results.every(result => result.explanation.length > 0)).toBe(
      true
    );
  });

  it("treats missing answers as incorrect and rejects unknown courses cleanly", () => {
    expect(gradeCourseQuiz("blockchain-foundations", [])).toMatchObject({
      score: 0,
      passed: false,
    });
    expect(getPublicCourse("does-not-exist")).toBeNull();
    expect(gradeCourseQuiz("does-not-exist", [])).toBeNull();
  });
});
