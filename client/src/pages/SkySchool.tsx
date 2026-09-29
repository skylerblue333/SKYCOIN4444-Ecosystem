import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Gamepad2,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getDeviceCourseProgress,
  markDeviceLessonComplete,
  saveDeviceQuizResult,
  type DeviceCourseProgress,
} from "@/lib/learning-progress";

export default function SkySchool() {
  const catalogQuery = trpc.education.catalog.useQuery();
  const capabilityQuery = trpc.education.capability.useQuery();
  const initialCourseId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("course")
      : null;
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialCourseId
  );

  useEffect(() => {
    if (!selectedCourseId && catalogQuery.data?.[0]?.id) {
      setSelectedCourseId(catalogQuery.data[0].id);
    }
  }, [catalogQuery.data, selectedCourseId]);

  const courseQuery = trpc.education.course.useQuery(
    { courseId: selectedCourseId ?? "" },
    { enabled: Boolean(selectedCourseId) }
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
        <section className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-cyan-500/10 via-card to-primary/15 p-6 lg:p-9">
          <Badge className="mb-4 border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            SkySchool learning beta
          </Badge>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                Learn the systems you are building.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                SkySchool now serves a deterministic curriculum from the
                backend and grades knowledge checks server-side. Learning
                progress on this screen is stored only on this device until a
                canonical account-progress schema is added.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/hopeai">
                <Button variant="outline" className="w-full gap-2">
                  <Bot className="h-4 w-4" /> HopeAI
                </Button>
              </Link>
              <Link href="/charity">
                <Button variant="outline" className="w-full gap-2">
                  <Heart className="h-4 w-4" /> SkyHope
                </Button>
              </Link>
              <Link href="/socialmedia">
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" /> Social
                </Button>
              </Link>
              <Link href="/gaming">
                <Button variant="outline" className="w-full gap-2">
                  <Gamepad2 className="h-4 w-4" /> Games
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Capability
            label="Curriculum"
            value={capabilityQuery.data?.curriculum ?? "checking"}
          />
          <Capability
            label="Quiz grading"
            value={capabilityQuery.data?.quizGrading ?? "checking"}
          />
          <Capability
            label="Account progress"
            value={capabilityQuery.data?.serverProgressPersistence ?? "checking"}
          />
          <Capability
            label="Certificates"
            value={capabilityQuery.data?.certificates ?? "checking"}
          />
          <Capability
            label="Token rewards"
            value={capabilityQuery.data?.tokenRewards ?? "checking"}
          />
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <div>
              <h2 className="text-lg font-bold">Courses</h2>
              <p className="text-xs text-muted-foreground">
                {catalogQuery.data?.length ?? 0} verified curriculum paths
              </p>
            </div>
            {catalogQuery.isLoading && (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Loading curriculum…
                </CardContent>
              </Card>
            )}
            {catalogQuery.data?.map(course => (
              <button
                type="button"
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedCourseId === course.id
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-card/50 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="outline">{course.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {course.level}
                  </span>
                </div>
                <h3 className="mt-3 font-bold">{course.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {course.description}
                </p>
                <div className="mt-3 flex gap-3 text-[11px] text-muted-foreground">
                  <span>{course.lessonCount} lessons</span>
                  <span>{course.totalMinutes} min</span>
                  <span>{course.quizQuestions} questions</span>
                </div>
              </button>
            ))}
          </aside>

          <section>
            {courseQuery.isLoading && (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  Loading course…
                </CardContent>
              </Card>
            )}
            {courseQuery.data && (
              <CourseWorkspace
                course={courseQuery.data}
                key={courseQuery.data.id}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function CourseWorkspace({
  course,
}: {
  course: NonNullable<
    ReturnType<typeof trpc.education.course.useQuery>["data"]
  >;
}) {
  const [activeLessonId, setActiveLessonId] = useState(
    course.lessons[0]?.id ?? ""
  );
  const [progress, setProgress] = useState<DeviceCourseProgress | null>(() =>
    getDeviceCourseProgress(course.id)
  );

  const activeLesson =
    course.lessons.find(lesson => lesson.id === activeLessonId) ??
    course.lessons[0];

  const progressPercent =
    course.lessons.length === 0
      ? 0
      : Math.round(
          ((progress?.completedLessonIds.length ?? 0) / course.lessons.length) *
            100
        );

  const completeLesson = () => {
    if (!activeLesson) return;
    setProgress(markDeviceLessonComplete(course.id, activeLesson.id));
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="outline">{course.category}</Badge>
              <h2 className="mt-3 text-3xl font-black">{course.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {course.description}
              </p>
            </div>
            <div className="min-w-44 rounded-xl border border-border/50 bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Device progress</p>
              <p className="mt-1 text-lg font-bold">{progressPercent}%</p>
              <Progress value={progressPercent} className="mt-2 h-2" />
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {course.outcomes.map(outcome => (
              <div
                key={outcome}
                className="rounded-xl border border-border/40 bg-muted/20 p-3 text-xs leading-5"
              >
                <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-400" />
                {outcome}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {course.lessons.map((lesson, index) => {
              const complete =
                progress?.completedLessonIds.includes(lesson.id) ?? false;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    lesson.id === activeLessonId
                      ? "border-primary bg-primary/10"
                      : "border-border/40 hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      {index + 1}. {lesson.title}
                    </span>
                    {complete && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {lesson.minutes} min
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-5">
          {activeLesson && (
            <Card>
              <CardHeader>
                <CardTitle>{activeLesson.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeLesson.summary}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    Learning objectives
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeLesson.objectives.map(objective => (
                      <div
                        key={objective}
                        className="flex gap-2 rounded-lg bg-muted/30 p-3 text-xs"
                      >
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {activeLesson.body.map(paragraph => (
                    <p
                      key={paragraph}
                      className="text-sm leading-7 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-4">
                  <p className="text-xs text-muted-foreground">
                    Completion is saved to this browser only.
                  </p>
                  <Button
                    onClick={completeLesson}
                    disabled={
                      progress?.completedLessonIds.includes(activeLesson.id) ??
                      false
                    }
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {progress?.completedLessonIds.includes(activeLesson.id)
                      ? "Completed"
                      : "Mark complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <QuizPanel
            courseId={course.id}
            passingScore={course.quiz.passingScore}
            questions={course.quiz.questions}
            onSaved={setProgress}
          />
        </div>
      </div>
    </div>
  );
}

function QuizPanel({
  courseId,
  passingScore,
  questions,
  onSaved,
}: {
  courseId: string;
  passingScore: number;
  questions: Array<{ id: string; prompt: string; options: string[] }>;
  onSaved: (progress: DeviceCourseProgress) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [grade, setGrade] = useState<{
    score: number;
    passed: boolean;
    correct: number;
    total: number;
    results: Array<{
      questionId: string;
      selectedIndex: number | null;
      correctIndex: number;
      correct: boolean;
      explanation: string;
    }>;
  } | null>(null);

  const gradeQuiz = trpc.education.gradeQuiz.useMutation({
    onSuccess: result => {
      if (!result) return;
      setGrade(result);
      onSaved(saveDeviceQuizResult(courseId, result.score, result.passed));
    },
  });

  const answeredCount = Object.keys(answers).length;
  const resultById = useMemo(
    () => new Map(grade?.results.map(result => [result.questionId, result]) ?? []),
    [grade]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Knowledge check
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Server-graded · {questions.length} questions · passing score{" "}
          {passingScore}%
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {questions.map((question, questionIndex) => {
          const result = resultById.get(question.id);
          return (
            <div
              key={question.id}
              className="rounded-2xl border border-border/50 p-4"
            >
              <p className="font-semibold">
                {questionIndex + 1}. {question.prompt}
              </p>
              <div className="mt-3 grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex;
                  const correct = result?.correctIndex === optionIndex;
                  const wrongSelected =
                    Boolean(result) && selected && !result.correct;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={Boolean(grade)}
                      onClick={() =>
                        setAnswers(current => ({
                          ...current,
                          [question.id]: optionIndex,
                        }))
                      }
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        correct
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : wrongSelected
                            ? "border-red-500/50 bg-red-500/10"
                            : selected
                              ? "border-primary bg-primary/10"
                              : "border-border/40 hover:border-primary/30"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {result && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {result.explanation}
                </p>
              )}
            </div>
          );
        })}

        {grade ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-2xl font-black">{grade.score}%</p>
            <p className="text-sm">
              {grade.passed ? "Passed" : "Keep learning and try again"} ·{" "}
              {grade.correct}/{grade.total} correct
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              This is a learning assessment, not an accredited certificate or
              token reward.
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => {
                setAnswers({});
                setGrade(null);
              }}
            >
              Retake quiz
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {answeredCount}/{questions.length} answered
            </span>
            <Button
              disabled={
                answeredCount !== questions.length || gradeQuiz.isPending
              }
              onClick={() =>
                gradeQuiz.mutate({
                  courseId,
                  answers: Object.entries(answers).map(
                    ([questionId, optionIndex]) => ({
                      questionId,
                      optionIndex,
                    })
                  ),
                })
              }
            >
              {gradeQuiz.isPending ? "Grading…" : "Grade quiz"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Capability({ label, value }: { label: string; value: string }) {
  const available = value === "available";
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-xs font-semibold ${
          available ? "text-emerald-400" : "text-amber-300"
        }`}
      >
        {value.replaceAll("_", " ")}
      </p>
    </div>
  );
}
