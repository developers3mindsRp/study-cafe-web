import clsx from "clsx";
import type { ProgressSessionRow } from "@/services/progress.service";

type Props = {
  sessions: ProgressSessionRow[];
  activeId: number | null;
  onSelect: (sessionId: number) => void;
};

export default function SessionSidebar({ sessions, activeId, onSelect }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">Course content</h3>
      <ul className="max-h-[60vh] space-y-1 overflow-y-auto text-sm">
        {sessions.map((s) => (
          <li key={s.sessionId}>
            <button
              type="button"
              onClick={() => onSelect(s.sessionId)}
              className={clsx(
                "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition",
                activeId === s.sessionId
                  ? "bg-[#09339B]/10 text-[#09339B]"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className="mt-0.5 text-xs text-gray-400">
                {s.status === "completed" ? "✓" : "○"}
              </span>
              <span className="line-clamp-2">
                Day {s.dayNumber}
                {s.sectionIndex > 0 ? ` · Part ${s.sectionIndex + 1}` : ""}
                {s.title ? ` — ${s.title}` : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
