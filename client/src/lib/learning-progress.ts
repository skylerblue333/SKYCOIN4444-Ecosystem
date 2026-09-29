export interface DeviceCourseProgress {
  courseId: string;
  completedLessonIds: string[];
  quizScore: number | null;
  quizPassed: boolean | null;
  updatedAt: string;
}

const STORAGE_KEY = "skycoin4444.learning-progress.v1";

function readAll(): Record<string, DeviceCourseProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, DeviceCourseProgress>)
      : {};
  } catch {
    return {};
  }
}

function writeAll(value: Record<string, DeviceCourseProgress>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Device-local progress is optional and must not block learning content.
  }
}

export function getDeviceLearningProgress(): DeviceCourseProgress[] {
  return Object.values(readAll()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
}

export function getDeviceCourseProgress(
  courseId: string
): DeviceCourseProgress | null {
  return readAll()[courseId] ?? null;
}

export function markDeviceLessonComplete(
  courseId: string,
  lessonId: string
): DeviceCourseProgress {
  const all = readAll();
  const current = all[courseId] ?? {
    courseId,
    completedLessonIds: [],
    quizScore: null,
    quizPassed: null,
    updatedAt: new Date(0).toISOString(),
  };
  const completedLessonIds = Array.from(
    new Set([...current.completedLessonIds, lessonId])
  );
  const next = {
    ...current,
    completedLessonIds,
    updatedAt: new Date().toISOString(),
  };
  all[courseId] = next;
  writeAll(all);
  return next;
}

export function saveDeviceQuizResult(
  courseId: string,
  score: number,
  passed: boolean
): DeviceCourseProgress {
  const all = readAll();
  const current = all[courseId] ?? {
    courseId,
    completedLessonIds: [],
    quizScore: null,
    quizPassed: null,
    updatedAt: new Date(0).toISOString(),
  };
  const next = {
    ...current,
    quizScore: score,
    quizPassed: passed,
    updatedAt: new Date().toISOString(),
  };
  all[courseId] = next;
  writeAll(all);
  return next;
}
