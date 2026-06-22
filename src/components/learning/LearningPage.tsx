import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import { PublicLayout } from "@/components/layout";
import CourseDetailProfile from "@/components/CourseDetailProfile";
import { getCourseById } from "@/services/platform.service";
import {
  useCourseProgress,
  useHeartbeat,
  useMarkSessionComplete,
} from "@/hooks/usePurchases";
import { downloadCertificate } from "@/services/progress.service";
import type { CoursePublicDetail } from "@/types/models.types";
import type { ProgressSessionRow } from "@/services/progress.service";
import { parseVimeoIdFromUrl } from "@/utils/vimeo";

type Props = {
  courseId: string;
  slug: string;
};
type CurriculumFile = {
  id: number;
  url: string;
  label: string;
  mime_type: string;
};

type CurriculumDay = {
  title: string;
  files: CurriculumFile[];
};
function instructorLine(course: CoursePublicDetail | null): string | null {
  if (!course) return null;
  const a = course.authors?.[0];
  if (a?.name?.trim()) return `Instructor: ${a.name.trim()}`;
  if (course.author_name?.trim()) return `Instructor: ${course.author_name.trim()}`;
  return null;
}

function BrandedSpinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      role="presentation"
      aria-hidden
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M12 2a10 10 0 0 1 9.5 6.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LearningPageLoading({ phase }: { phase: "course" | "progress" }) {
  const label = phase === "course" ? "Loading course" : "Loading your progress";
  const detail =
    phase === "course"
      ? "Fetching course details and outline…"
      : "Preparing lessons and your saved progress…";

  return (
    <PublicLayout>
      <div
        className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label}
      >
        <div className="container mx-auto px-4 py-6 sm:px-6">
          <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="space-y-3">
              <div className="h-8 w-full max-w-xl animate-pulse rounded-lg bg-slate-200" />
              <div className="h-5 w-64 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-28 animate-pulse rounded-md bg-slate-200" />
              <div className="h-10 w-32 animate-pulse rounded-md bg-slate-100" />
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-[#9FBBFF]/60 bg-white p-4 shadow-sm">
            <div className="mb-3 flex justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/3 animate-pulse bg-[#09339B]/30" />
            </div>
            <div className="mt-3 flex justify-between">
              <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 rounded-xl border border-[#9FBBFF]/60 bg-white p-4 shadow-sm lg:col-span-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50/90">
                  <BrandedSpinner className="h-10 w-10 text-[#09339B]" />
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <p className="max-w-sm px-4 text-center text-xs text-slate-400">{detail}</p>
                </div>
              </div>
              <div className="h-4 w-3/4 max-w-md animate-pulse rounded bg-slate-100" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="space-y-3 rounded-xl border border-[#9FBBFF]/60 bg-white p-4 shadow-sm">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-lg border border-slate-100 p-2.5"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="mt-0.5 h-9 w-9 shrink-0 rounded-md bg-slate-100" />
                  <div className="min-w-0 flex-1 space-y-2 py-0.5">
                    <div className="h-3.5 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function LearningPage({ courseId, slug }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const overallInvalidatedFor = useRef<string | null>(null);
  const [course, setCourse] = useState<CoursePublicDetail | null>(null);
  const { data: progress, isLoading: progLoading, refetch: refetchProgress } =
    useCourseProgress(courseId, { enabled: !!courseId });
  const heartbeat = useHeartbeat();
  const markComplete = useMarkSessionComplete();

  console.log(courseId,"courseId")

  useEffect(() => {
    if (courseId && progress && overallInvalidatedFor.current !== courseId) {
      overallInvalidatedFor.current = courseId;
      queryClient.invalidateQueries({ queryKey: [...queryKeys.progress.all, "overall"] });
    }
  }, [courseId, progress, queryClient]);

  const qSession = router.query.session;
  const querySessionId =
    typeof qSession === "string" && /^\d+$/.test(qSession) ? parseInt(qSession, 10) : null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = await getCourseById(courseId);
      if (!cancelled) setCourse(c);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);


  const sessions: ProgressSessionRow[] = progress?.sessions ?? [];

  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedRecordingId, setSelectedRecordingId] = useState<number | null>(null);

  useEffect(() => {
    if (!sessions.length) return;
    if (querySessionId && sessions.some((s) => Number(s.sessionId) === querySessionId)) {
      setActiveId(querySessionId);
      return;
    }
    const last = progress?.lastSessionId ? parseInt(String(progress.lastSessionId), 10) : null;
    if (last && sessions.some((s) => Number(s.sessionId) === last)) {
      setActiveId(last);
      return;
    }
    const firstIncomplete = sessions.find((s) => s.status !== "completed");
    setActiveId(
      firstIncomplete?.sessionId != null
        ? Number(firstIncomplete.sessionId)
        : sessions[0]?.sessionId != null
          ? Number(sessions[0].sessionId)
          : null
    );
  }, [sessions, progress?.lastSessionId, querySessionId]);

  const active = useMemo(
    () => sessions.find((s) => Number(s.sessionId) === activeId) ?? null,
    [sessions, activeId]
  );

  const activeRecordings = useMemo(() => {
    const list = active?.recordings ?? [];
    return list.filter((r) => r?.url && String(r.url).trim() !== "");
  }, [active]);

  useEffect(() => {
    if (activeRecordings.length === 0) {
      setSelectedRecordingId(null);
      return;
    }
    setSelectedRecordingId((prev) => {
      if (prev != null && activeRecordings.some((r) => r.id === prev)) return prev;
      return activeRecordings[0].id;
    });
  }, [activeId, activeRecordings]);

  const videoId = useMemo(() => {
    const r =
      activeRecordings.find((x) => x.id === selectedRecordingId) || activeRecordings[0];
    if (!r?.url) return null;
    return parseVimeoIdFromUrl(r.url);
  }, [activeRecordings, selectedRecordingId]);

  const onTimeUpdate = useCallback(
    (seconds: number) => {
      if (!activeId) return;
      heartbeat.mutate({
        sessionId: activeId,
        watchSeconds: Math.floor(seconds),
        durationSeconds: active?.durationSeconds ?? undefined,
      });
    },
    [activeId, active?.durationSeconds, heartbeat]
  );

  const onVideoEnded = useCallback(() => {
    if (!activeId) return;
    markComplete.mutate(activeId, {
      onSuccess: () => refetchProgress(),
    });
  }, [activeId, markComplete, refetchProgress]);

  const onMarkComplete = useCallback(() => {
    if (!activeId) return;
    markComplete.mutate(activeId, { onSuccess: () => refetchProgress() });
  }, [activeId, markComplete, refetchProgress]);

  const idx = sessions.findIndex((s) => Number(s.sessionId) === activeId);
  const onPrev = () => {
    if (idx > 0) setActiveId(Number(sessions[idx - 1].sessionId));
  };
  const onNext = () => {
    if (idx >= 0 && idx < sessions.length - 1) setActiveId(Number(sessions[idx + 1].sessionId));
  };

  const percent = progress?.percent ?? 0;
  const isComplete = progress?.status === "completed";
  const completedLessons = progress?.completedSessions ?? 0;
  const totalLessons = progress?.totalSessions ?? sessions.length;


const activeSession = sessions.find(
  (s) => Number(s.sessionId) === activeId
);

const selectedDayFiles = useMemo(() => {
  if (!activeSession || !Array.isArray(course?.curriculum)) return [];

  const curriculum = course.curriculum as CurriculumDay[];

  const day = curriculum.find(
    (item) =>
      item.title?.trim().toLowerCase() ===
      activeSession.title?.trim().toLowerCase()
  );

  return (day?.files ?? []).map((file) => ({
    day: day?.title,
    title: day?.title,
    file,
  }));
}, [course?.curriculum, activeSession]);


  const onCertificateDownload = useCallback(async () => {
    await downloadCertificate(courseId);
  }, [courseId]);

  if (!course) {
    return <LearningPageLoading phase="course" />;
  }

  if (progLoading) {
    return <LearningPageLoading phase="progress" />;
  }

  if (sessions.length === 0) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg p-8 text-center text-gray-600">
          <p className="font-medium">No lessons available yet</p>
          <p className="mt-2 text-sm">
            Your batch may not have sessions, or recordings are not visible yet. Check back later or
            open the{" "}
            <a className="text-[#09339B] underline" href={`/course/${encodeURIComponent(slug)}`}>
              course page
            </a>
            .
          </p>
        </div>
      </PublicLayout>
    );
  }


console.log(course,"courseTitle")
  return (
    <PublicLayout>
      
      <CourseDetailProfile
        courseTitle={course.title}
        certificate_enabled={course?.certificate_enabled}
        instructorLine={instructorLine(course)}
        courseId={courseId}
        courseThumbnailUrl={course.thumbnail_url}
        percent={percent}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={(id) => setActiveId(id)}
        activeRecordings={activeRecordings}
        selectedRecordingId={selectedRecordingId}
        onSelectRecording={(id) => setSelectedRecordingId(id)}
        videoId={videoId}
        videoPlayerKey={`${activeId ?? ""}-${selectedRecordingId ?? ""}-${videoId ?? ""}`}
        onTimeUpdate={onTimeUpdate}
        onVideoEnded={onVideoEnded}
        startSeconds={active?.watchSeconds ?? 0}
        activeTitle={active?.title ?? null}
        onPrev={onPrev}
        onNext={onNext}
        onMarkComplete={onMarkComplete}
        canPrev={idx > 0}
        canNext={idx >= 0 && idx < sessions.length - 1}
        isCourseComplete={isComplete}
        onCertificateDownload={onCertificateDownload}
         curriculumFiles={selectedDayFiles}
      />
    </PublicLayout>
  );
}
