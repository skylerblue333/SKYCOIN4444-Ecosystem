import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronRight, Clock, ShieldCheck } from "lucide-react";

export default function CourseCatalog() {
  const catalog = trpc.education.catalog.useQuery();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
        <div className="mb-8">
          <Badge className="mb-3">Verified curriculum catalog</Badge>
          <h1 className="text-4xl font-black tracking-tight">Course Catalog</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            These courses are served by the SKYCOIN4444 education core. Counts
            describe actual curriculum objects, not invented enrollment or
            popularity metrics.
          </p>
        </div>

        {catalog.isLoading && (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              Loading curriculum…
            </CardContent>
          </Card>
        )}

        {catalog.isError && (
          <Card className="border-destructive/30">
            <CardContent className="py-10 text-center text-destructive">
              Course catalog unavailable: {catalog.error.message}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {catalog.data?.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="outline">{course.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {course.level}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold">{course.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {course.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {course.lessonCount} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.totalMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {course.quizQuestions} graded questions
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {course.outcomes.slice(0, 3).map(outcome => (
                    <p
                      key={outcome}
                      className="text-xs leading-5 text-muted-foreground"
                    >
                      • {outcome}
                    </p>
                  ))}
                </div>

                <Link href={`/skyschool?course=${course.id}`}>
                  <Button className="mt-5 w-full">
                    Open course
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
