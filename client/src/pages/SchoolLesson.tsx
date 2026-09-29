import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  HelpCircle,
  MessageSquare,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const LESSONS = [
  { id: 1, title: "What is Blockchain?", duration: "12:34", type: "video" },
  { id: 2, title: "History & Evolution", duration: "8:21", type: "video" },
  { id: 3, title: "Cryptographic Hashing", duration: "18:45", type: "video" },
  { id: 4, title: "Consensus Mechanisms", duration: "22:10", type: "video" },
  { id: 5, title: "Proof of Work", duration: "19:33", type: "video" },
  { id: 6, title: "Proof of Stake", duration: "14:22", type: "video" },
  { id: 7, title: "Module 1 Quiz", duration: "5:00", type: "quiz" },
  { id: 8, title: "Smart Contracts Intro", duration: "16:44", type: "video" },
] as const;

const COMPLETION_KEY = "skycoin4444.learning.completed.v1";
const notesKey = (lessonId: number) => `skycoin4444.learning.notes.${lessonId}.v1`;

function loadCompletedLessonIds(): number[] {
  if (typeof window === "undefined") return Array<number>();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(COMPLETION_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter(value => Number.isInteger(value)).map(Number)
      : [];
  } catch {
    return Array<number>();
  }
}

export default function SchoolLesson() {
  const params = useParams<{ id?: string }>();
  const parsedLessonId = Number(params.id ?? "1");
  const lessonId = Number.isInteger(parsedLessonId) && parsedLessonId > 0
    ? parsedLessonId
    : 1;
  const lesson = LESSONS.find(item => item.id === lessonId) ?? LESSONS[0];

  const [activeTab, setActiveTab] = useState<"notes" | "resources" | "discussion">("notes");
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    setCompletedIds(loadCompletedLessonIds());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setNotes(window.localStorage.getItem(notesKey(lesson.id)) ?? "");
    setNotesSaved(false);
  }, [lesson.id]);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const progress = Math.round((completedSet.size / LESSONS.length) * 100);
  const completed = completedSet.has(lesson.id);

  const markComplete = () => {
    const next = Array.from(new Set([...completedIds, lesson.id])).sort((a, b) => a - b);
    setCompletedIds(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COMPLETION_KEY, JSON.stringify(next));
    }
  };

  const saveNotes = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(notesKey(lesson.id), notes);
    setNotesSaved(true);
  };

  const previousId = Math.max(1, lesson.id - 1);
  const nextId = Math.min(LESSONS.length, lesson.id + 1);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b border-border/50 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center">
          <Link href="/schooldashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Learning dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress saved on this browser</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            beta-local progress
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-border/50 bg-card/30 p-3">
          <h2 className="px-2 py-2 text-sm font-semibold">Blockchain Fundamentals</h2>
          <div className="space-y-1">
            {LESSONS.map(item => (
              <Link key={item.id} href={`/school/lesson/${item.id}`}>
                <button
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    item.id === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-muted/40"
                  }`}
                >
                  {completedSet.has(item.id) ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : item.type === "quiz" ? (
                    <HelpCircle className="h-4 w-4 shrink-0 text-amber-400" />
                  ) : (
                    <Play className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{item.title}</span>
                    <span className="block text-[11px] text-muted-foreground">{item.duration}</span>
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border/50 bg-zinc-950">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/5">
              <div className="max-w-md px-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
                <p className="mt-2 text-sm text-white/60">
                  Lesson player preview · no hosted media stream is claimed for this screen.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/50 bg-card/30 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Lesson {lesson.id} of {LESSONS.length}
                </p>
                <h2 className="mt-1 text-2xl font-bold">{lesson.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Completion on this engineering-beta screen is stored in your browser only.
                  It is not represented as an account credential, token reward, or on-chain certificate.
                </p>
              </div>
              <Button
                onClick={markComplete}
                disabled={completed}
                className={completed ? "bg-emerald-500/15 text-emerald-300" : ""}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {completed ? "Completed on this browser" : "Mark complete"}
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-border/50 bg-card/30">
            <div className="flex border-b border-border/50 px-4 pt-2">
              {(["notes", "resources", "discussion"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-4 py-3 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "notes" && (
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Save className="h-4 w-4" />
                    Notes are stored only in this browser's local storage.
                  </div>
                  <textarea
                    value={notes}
                    onChange={event => {
                      setNotes(event.target.value);
                      setNotesSaved(false);
                    }}
                    placeholder="Write private lesson notes for this browser..."
                    className="h-44 w-full resize-none rounded-xl border border-border/50 bg-background/60 p-4 text-sm outline-none focus:border-primary"
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <Button size="sm" onClick={saveNotes}>
                      Save notes locally
                    </Button>
                    {notesSaved && (
                      <span className="text-xs text-emerald-400">Saved on this browser.</span>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="font-semibold">No downloadable resources published</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The previous placeholder PDFs/ZIP files were removed so this beta does not imply
                    downloads exist when no backed resource is configured.
                  </p>
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="font-semibold">Lesson discussion is not connected yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the persisted social feed or community workspace instead of simulated comments.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Link href="/socialmedia">
                      <Button size="sm">Open social feed</Button>
                    </Link>
                    <Link href="/communityhub">
                      <Button size="sm" variant="outline">Community hub</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex items-center justify-between gap-3">
            <Link href={`/school/lesson/${previousId}`}>
              <Button variant="outline" disabled={lesson.id === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            </Link>
            {lesson.type === "quiz" ? (
              <Link href="/school/quiz">
                <Button>
                  Open quiz
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/school/lesson/${nextId}`}>
                <Button disabled={lesson.id === LESSONS.length}>
                  Next lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
