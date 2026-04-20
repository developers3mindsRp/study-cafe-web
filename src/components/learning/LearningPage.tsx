import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
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

type Props = {
  courseId: string;
  slug: string;
};

function instructorLine(course: CoursePublicDetail | null): string | null {
  if (!course) return null;
  const a = course.authors?.[0];
  if (a?.name?.trim()) return `Instructor: ${a.name.trim()}`;
  if (course.author_name?.trim()) return `Instructor: ${course.author_name.trim()}`;
  return null;
}

function parseVimeoIdFromRecordingUrl(url: string): string | null {
  const u = String(url).trim();
  if (!u) return null;
  if (/^\d+$/.test(u)) return u;
  const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m ? m[1] : u;
}

export default function LearningPage({ courseId, slug }: Props) {
  const router = useRouter();
  const [course, setCourse] = useState<CoursePublicDetail | null>(null);
  const { data: progress, isLoading: progLoading, refetch: refetchProgress } =
    useCourseProgress(courseId, { enabled: !!courseId });
  const heartbeat = useHeartbeat();
  const markComplete = useMarkSessionComplete();

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
    return parseVimeoIdFromRecordingUrl(r.url);
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

  const onCertificateDownload = useCallback(async () => {
    await downloadCertificate(courseId);
  }, [courseId]);

  if (!course) {
    return (
      <PublicLayout>
        <div className="p-8 text-center text-gray-500">Loading course…</div>
      </PublicLayout>
    );
  }

  if (progLoading) {
    return (
      <PublicLayout>
        <div className="p-8 text-center text-gray-500">Loading progress…</div>
      </PublicLayout>
    );
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

  return (
    <PublicLayout>
      <CourseDetailProfile
        courseTitle={course.title}
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
      />
    </PublicLayout>
  );
}
