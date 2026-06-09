"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Certificate from "./Certificate";
import ReviewPage from "./Review";
import VimeoPlayer from "@/components/learning/VimeoPlayer";
import { resolveApiAssetUrl } from "@/utils/mediaUrl";
import { sessionListLabel } from "@/utils/sessionLabel";
import type { ProgressSessionRow } from "@/services/progress.service";
import {
  firstVimeoIdFromSession,
  prefetchVimeoThumbnails,
} from "@/utils/vimeo";

/** Clock-style length (uses Vimeo duration when available). */
function formatVideoClock(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "—";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function formatTotalDuration(seconds: number): string {
  if (seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hour${h > 1 ? "s" : ""} ${m} minutes`;
  return `${m} minutes`;
}

export type CourseDetailProfileProps = {
  courseTitle: string;
  instructorLine?: string | null;
  courseId: string;
  courseThumbnailUrl?: string | null;
  percent: number;
  completedLessons: number;
  totalLessons: number;
  sessions: ProgressSessionRow[];
  activeSessionId: number | null;
  onSelectSession: (id: number) => void;
  activeRecordings: Array<{ id: number; url: string }>;
  selectedRecordingId: number | null;
  onSelectRecording: (id: number) => void;
  videoId: string | null;
  /** Remount player when session or recording changes */
  videoPlayerKey: string;
  onTimeUpdate: (seconds: number) => void;
  onVideoEnded: () => void;
  startSeconds: number;
  activeTitle: string | null;
  onPrev: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  canPrev: boolean;
  canNext: boolean;
  isCourseComplete: boolean;
  onCertificateDownload: () => void | Promise<void>;
  backHref?: string;
};

export default function CourseDetailProfile({
  courseTitle,
  instructorLine,
  courseId,
  courseThumbnailUrl,
  percent,
  completedLessons,
  totalLessons,
  sessions,
  activeSessionId,
  onSelectSession,
  activeRecordings,
  selectedRecordingId,
  onSelectRecording,
  videoId,
  videoPlayerKey,
  onTimeUpdate,
  onVideoEnded,
  startSeconds,
  activeTitle,
  onPrev,
  onNext,
  onMarkComplete,
  canPrev,
  canNext,
  isCourseComplete,
  onCertificateDownload,
  backHref = "/dashboard",
}: CourseDetailProfileProps) {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [vimeoDurationSeconds, setVimeoDurationSeconds] = useState<number | null>(null);
  const [vimeoThumbnailsById, setVimeoThumbnailsById] = useState<Record<string, string>>({});
  const thumb =
    resolveApiAssetUrl(courseThumbnailUrl ?? "") || "/images/home/f1.jpg";

  useEffect(() => {
    setVimeoDurationSeconds(null);
  }, [videoPlayerKey]);

  useEffect(() => {
    const ids: string[] = [];
    for (const s of sessions) {
      const id = firstVimeoIdFromSession(s);
      if (id) ids.push(id);
    }
    if (ids.length === 0) {
      return;
    }
    let cancelled = false;
    (async () => {
      const map = await prefetchVimeoThumbnails(ids);
      if (cancelled) return;
      setVimeoThumbnailsById((prev) => ({ ...prev, ...map }));
    })();
    return () => {
      cancelled = true;
    };
  }, [sessions]);

  const sessionsByDay = useMemo(() => {
    const m = new Map<number, ProgressSessionRow[]>();
    for (const s of sessions) {
      const d = s.dayNumber;
      if (!m.has(d)) m.set(d, []);
      m.get(d)!.push(s);
    }
    Array.from(m.values()).forEach((list) => {
      list.sort(
        (a: ProgressSessionRow, b: ProgressSessionRow) =>
          a.sectionIndex - b.sectionIndex || a.sessionId - b.sessionId
      );
    });
    return m;
  }, [sessions]);

  const sortedDays = useMemo(
    () => Array.from(sessionsByDay.keys()).sort((a, b) => a - b),
    [sessionsByDay]
  );

  const active = useMemo(
    () => sessions.find((s) => s.sessionId === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const sectionHeading = useMemo(() => {
    if (!active) return "—";
    const peers = sessionsByDay.get(active.dayNumber) ?? [];
    return sessionListLabel(active, peers);
  }, [active, sessionsByDay]);

  const totalDurationSeconds = useMemo(
    () =>
      sessions.reduce(
        (acc, s) => acc + (s.durationSeconds && s.durationSeconds > 0 ? s.durationSeconds : 0),
        0
      ),
    [sessions]
  );

  useEffect(() => {
    const cur = sessions.find((s) => s.sessionId === activeSessionId);
    if (cur) setOpenDay(cur.dayNumber);
  }, [activeSessionId, sessions]);

  const onCertDownloadClick = useCallback(async () => {
    try {
      await onCertificateDownload();
    } catch (e) {
      console.error(e);
    }
  }, [onCertificateDownload]);

  return (
    <div className="container mx-auto px-6 py-6">
      <Link
        href={backHref}
        className="mb-3 block cursor-pointer text-[16px] text-[#09339B]"
      >
        ← Back to My Courses
      </Link>

      <div className="items-start justify-between gap-4 md:flex">
        <div>
          <h1 className="text-[20px] font-semibold xl:text-[40px]">
            {courseTitle}
          </h1>
          {instructorLine ? (
            <p className="mt-1 text-[24px] text-gray-500">{instructorLine}</p>
          ) : null}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="rounded-md bg-[#09339B] px-4 py-2 text-white"
            onClick={() => setIsReviewOpen(true)}
          >
            Write Review
          </button>

          {isReviewOpen && (
            <ReviewPage
              courseId={courseId}
              onClose={() => setIsReviewOpen(false)}
            />
          )}

          <button
            type="button"
            disabled={!isCourseComplete}
            title={
              isCourseComplete
                ? undefined
                : "Complete the course to download your certificate"
            }
            onClick={() => isCourseComplete && setIsCertificateOpen(true)}
            className="flex items-center gap-2 rounded-md border px-4 py-2 text-[#09339B] transition hover:bg-[#f0f4ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <img
              src="/images/award.png"
              alt="Certificate icon"
              className="h-5 w-5"
            />
            <span className="font-medium">Certificate</span>
          </button>

          {isCertificateOpen && (
            <Certificate
              courseId={courseId}
              onClose={() => setIsCertificateOpen(false)}
              onDownload={onCertDownloadClick}
            />
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-[#9FBBFF] bg-white p-4">
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-[16px] font-normal">Course Progress</span>
          <span>{Math.round(percent)}% Completed</span>
        </div>

        <div className="h-2 w-full rounded bg-gray-200">
          <div
            className="h-2 rounded bg-[#09339B] transition-all"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>

        <div className="mt-4 flex justify-between text-[16px] text-[#AFAFAF]">
          <span>
            {completedLessons} of {totalLessons} lessons completed
          </span>
          <span className="flex items-center gap-2 text-sm text-[#AFAFAF]">
            <img
              src="/images/icon-clock.png"
              alt=""
              className="h-4 w-4"
            />
            {formatTotalDuration(totalDurationSeconds)}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#9FBBFF] bg-white p-4 lg:col-span-2">
          <div className="relative overflow-hidden rounded-lg">
            {videoId ? (
              <VimeoPlayer
                key={videoPlayerKey}
                videoId={videoId}
                onTimeUpdate={onTimeUpdate}
                onEnded={onVideoEnded}
                onDuration={setVimeoDurationSeconds}
                startSeconds={startSeconds}
              />
            ) : (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb}
                  alt={courseTitle}
                  className="w-full object-cover xl:h-[475px]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-sm text-gray-700">
                    No video for this lesson yet
                  </span>
                </div>
              </div>
            )}
          </div>

          {activeRecordings.length > 1 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeRecordings.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRecording(r.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    selectedRecordingId === r.id
                      ? "border-[#09339B] bg-[#09339B] text-white"
                      : "border-[#9FBBFF] text-[#09339B] hover:bg-[#f0f4ff]"
                  }`}
                >
                  Video {i + 1}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-[12px] border border-[#9FBBFF] px-3 py-1 text-xs">
              {sectionHeading}
            </span>

            <span
              className="flex items-center gap-2 rounded-[12px] border border-[#9FBBFF] px-3 py-1 text-sm text-[#09339B] tabular-nums"
              title="Video length"
            >
              <img src="/images/time.png" alt="" className="h-4 w-4" />
              
              {formatVideoClock(vimeoDurationSeconds ?? active?.durationSeconds)}
            </span>
          </div>

          <h2 className="mt-3 text-[20px] font-normal xl:text-[26px]">
            {activeTitle || courseTitle}
          </h2>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onPrev}
              disabled={!canPrev}
              className="flex w-full items-center justify-center gap-2 rounded-md border bg-[#09339B] px-5 py-2 text-[14px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto md:px-8 xl:text-[20px]"
            >
              <img src="/images/left.svg" alt="" className="w-4 md:w-auto" />
              Previous
            </button>
           {
          // videoId && 
            <button
              type="button"
              onClick={onMarkComplete}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[#9FBBFF] px-4 py-2 text-[14px] font-medium text-[#09339B] transition hover:bg-[#f0f4ff] focus:bg-[#09339B] focus:text-white xl:text-[20px] sm:w-auto"
            >
              <span>Mark as completed</span>
              <img
                src="/images/checkmark.png"
                alt=""
                className="h-5 w-5 md:h-6 md:w-6"
              />
            </button>
          
        }

            

            <button
              type="button"
              onClick={onNext}
              disabled={!canNext}
              className="flex w-full items-center justify-center gap-2 rounded-md border bg-[#09339B] px-5 py-2 text-[14px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto md:px-10 xl:text-[20px]"
            >
              Next
              <img src="/images/next.svg" alt="" className="w-4 md:w-auto" />
            </button>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-[#9FBBFF] bg-white p-4">
          <h3 className="mb-4 text-[26px]">Course Content</h3>

          {sortedDays.map((day) => {
            const daySessions = sessionsByDay.get(day) ?? [];
            const dayLabel = `Day ${day}`;
            return (
              <div key={day} className="border-b pb-3">
                <button
                  type="button"
                  onClick={() => setOpenDay(openDay === day ? null : day)}
                  className="flex w-full items-center justify-between text-sm font-medium"
                >
                  <span className="text-[18px] font-semibold xl:text-[20px]">
                    {dayLabel}
                  </span>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      openDay === day ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDay === day && (
                  <ul className="mt-3 space-y-3">
                    {daySessions.map((s) => {
                      const selected = s.sessionId === activeSessionId;
                      const label = sessionListLabel(s, daySessions);
                      const vimeoId = firstVimeoIdFromSession(s);
                      const listThumb =
                        (vimeoId && vimeoThumbnailsById[vimeoId]) || thumb;
                      return (
                        <li key={s.sessionId}>
                          <button
                            type="button"
                            onClick={() => onSelectSession(s.sessionId)}
                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left transition ${
                              selected
                                ? "bg-green-50 text-green-600"
                                : "text-[#929292] hover:bg-gray-100"
                            }`}
                          >
                            <div className="relative h-10 w-16 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={listThumb}
                                alt=""
                                className="h-full w-full rounded-md object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#09339B] text-[8px] text-white">
                                  <span className="ml-1">▶</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-medium">{label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
