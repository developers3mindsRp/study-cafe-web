import SessionSidebar from "./SessionSidebar";
import VimeoPlayer from "./VimeoPlayer";
import CompletionCertificateCard from "./CompletionCertificateCard";
import type { ProgressSessionRow } from "@/services/progress.service";

type Props = {
  title: string;
  percent: number;
  sessions: ProgressSessionRow[];
  activeSessionId: number | null;
  onSelectSession: (id: number) => void;
  videoId: string | null;
  onTimeUpdate: (seconds: number) => void;
  onVideoEnded: () => void;
  startSeconds: number;
  onMarkComplete: () => void;
  onPrev: () => void;
  onNext: () => void;
  courseId: string;
  isComplete: boolean;
  activeTitle: string | null;
};

export default function LearningLayout({
  title,
  percent,
  sessions,
  activeSessionId,
  onSelectSession,
  videoId,
  onTimeUpdate,
  onVideoEnded,
  startSeconds,
  onMarkComplete,
  onPrev,
  onNext,
  courseId,
  isComplete,
  activeTitle,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#09339B] transition-all"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">{percent}% complete</p>
      </div>

      {isComplete && (
        <div className="mb-6">
          <CompletionCertificateCard courseId={courseId} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {videoId ? (
            <VimeoPlayer
              videoId={videoId}
              onTimeUpdate={onTimeUpdate}
              onEnded={onVideoEnded}
              startSeconds={startSeconds}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              No video for this lesson yet.
            </div>
          )}
          {activeTitle && (
            <h2 className="mt-4 text-lg font-medium text-gray-800">{activeTitle}</h2>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onMarkComplete}
              className="rounded-md bg-[#09339B] px-4 py-2 text-sm text-white hover:bg-[#072a7a]"
            >
              Mark as completed
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
        <SessionSidebar
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={onSelectSession}
        />
      </div>
    </div>
  );
}
