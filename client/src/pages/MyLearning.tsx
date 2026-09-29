import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HardDrive,
} from "lucide-react";
import {
  getDeviceLearningProgress,
  type DeviceCourseProgress,
} from "@/lib/learning-progress";

export default function MyLearning() {
  const catalog = trpc.education.catalog.useQuery();
  const [progress, setProgress] = useState<DeviceCourseProgress[]>([]);

  useEffect(() => {
    setProgress(getDeviceLearningProgress());
  }, []);

  const coursesById = useMemo(
    () => new Map(catalog.data?.map(course => [course.id, course]) ?? []),
    [catalog.data]
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black">My Learning</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This beta tracks completion on this browser only. Progress is not
              yet synced to your SKYCOIN4444 account or claimed as a durable
              credential.
            </p>
          </div>
        </div>

        <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex gap-3 p-4">
            <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <p className="text-sm font-semibold">Device-local progress</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Clearing browser storage or switching devices can remove this
                progress. Server-side learning records and accredited
                certificates remain not configured.
              </p>
            </div>
          </CardContent>
        </Card>

        {progress.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
              <div>
                <p className="font-semibold">No device progress yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open a SkySchool lesson and mark it complete to start tracking
                  your progress on this device.
                </p>
              </div>
              <Link href="/skyschool">
                <Button>Start learning</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {progress.map(item => {
              const course = coursesById.get(item.courseId);
              const lessonCount = course?.lessonCount ?? 0;
              const percent =
                lessonCount === 0
                  ? 0
                  : Math.round(
                      (item.completedLessonIds.length / lessonCount) * 100
                    );

              return (
                <Card key={item.courseId}>
                  <CardContent className="p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {course?.category ?? "Course"}
                        </p>
                        <h2 className="mt-1 text-lg font-bold">
                          {course?.title ?? item.courseId}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.completedLessonIds.length}/{lessonCount || "?"}{" "}
                          lessons complete
                        </p>
                      </div>
                      {item.quizScore !== null && (
                        <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-2 text-center">
                          <p className="text-xs text-muted-foreground">
                            Latest quiz
                          </p>
                          <p className="font-bold">{item.quizScore}%</p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.quizPassed ? "passed" : "not yet passed"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <Progress value={percent} />
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{percent}% device completion</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          updated {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link href={`/skyschool?course=${item.courseId}`}>
                      <Button variant="outline" className="mt-4">
                        Continue course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
