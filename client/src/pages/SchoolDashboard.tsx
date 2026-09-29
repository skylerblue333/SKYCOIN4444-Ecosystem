import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const LESSON_COUNT = 8;
const COMPLETION_KEY = "skycoin4444.learning.completed.v1";

function readCompletedLessons(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(COMPLETION_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter(value => Number.isInteger(value) && value >= 1 && value <= LESSON_COUNT).map(Number)
      : [];
  } catch {
    return [];
  }
}

export default function SchoolDashboard() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    setCompletedLessons(readCompletedLessons());

    const sync = () => setCompletedLessons(readCompletedLessons());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const completed = useMemo(
    () => Array.from(new Set(completedLessons)).sort((a, b) => a - b),
    [completedLessons]
  );
  const percent = Math.round((completed.length / LESSON_COUNT) * 100);
  const nextLesson =
    Array.from({ length: LESSON_COUNT }, (_, index) => index + 1).find(
      lessonId => !completed.includes(lessonId)
    ) ?? LESSON_COUNT;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-black">My Learning</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              This dashboard reflects lesson completion saved in this browser by the current
              engineering-beta lesson flow. It does not invent account-level enrollments,
              token earnings, certificates, or on-chain credentials.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/skyschool">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse curriculum
              </Button>
            </Link>
            <Link href="/hopeai">
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Study with HopeAI
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300" />
            <div>
              <p className="font-semibold text-amber-200">Browser-local beta progress</p>
              <p className="mt-1 text-sm text-amber-100/70">
                Clearing browser storage or using another device can reset this view. Account-synced
                learning persistence remains a separate integration gate.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Lessons completed</p>
            <p className="mt-2 text-3xl font-black">{completed.length}/{LESSON_COUNT}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Local progress</p>
            <p className="mt-2 text-3xl font-black">{percent}%</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Verified credentials</p>
            <p className="mt-2 text-3xl font-black">0 claimed</p>
            <p className="mt-1 text-xs text-muted-foreground">
              No certificate is represented as issued by this browser-only flow.
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-border/50 bg-card/40 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Blockchain Fundamentals preview track
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {percent === 100 ? "Track locally complete" : "Continue where you left off"}
              </h2>
            </div>
            {percent === 100 ? (
              <Trophy className="h-8 w-8 text-amber-400" />
            ) : (
              <Play className="h-8 w-8 text-primary" />
            )}
          </div>
          <Progress value={percent} className="mb-5 h-2" />
          <div className="flex flex-wrap gap-2">
            <Link href={`/school/lesson/${nextLesson}`}>
              <Button>
                <Play className="mr-2 h-4 w-4" />
                {percent === 100 ? "Review lessons" : `Continue lesson ${nextLesson}`}
              </Button>
            </Link>
            <Link href="/school/quiz">
              <Button variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Open quiz
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Lesson progress</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: LESSON_COUNT }, (_, index) => index + 1).map(lessonId => {
              const done = completed.includes(lessonId);
              return (
                <Link key={lessonId} href={`/school/lesson/${lessonId}`}>
                  <div className="cursor-pointer rounded-xl border border-border/50 bg-card/30 p-4 transition-colors hover:border-primary/40">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">Lesson {lessonId}</span>
                      {done ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {done ? "Completed on this browser" : "Not yet marked complete"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
