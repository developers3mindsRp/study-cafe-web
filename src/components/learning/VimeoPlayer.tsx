"use client";

import { useEffect, useRef } from "react";

type Props = {
  videoId: string;
  /** Called ~every 15s with current seconds */
  onTimeUpdate?: (seconds: number) => void;
  onEnded?: () => void;
  /** Fired when the clip duration is known (Vimeo `getDuration()`, seconds) */
  onDuration?: (durationSeconds: number) => void;
  startSeconds?: number;
};

export default function VimeoPlayer({
  videoId,
  onTimeUpdate,
  onEnded,
  onDuration,
  startSeconds = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastEmitRef = useRef(0);
  const onDurationRef = useRef(onDuration);
  onDurationRef.current = onDuration;

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let destroyed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let player: any = null;

    (async () => {
      const mod = await import("@vimeo/player");
      const Player = mod.default;
      if (destroyed || !containerRef.current) return;
      const numericId = parseInt(String(videoId).replace(/\D/g, "") || "0", 10);
      player = new Player(containerRef.current, {
        id: numericId || Number(videoId),
        /** Fill the parent box instead of a fixed 640×360-style embed */
        responsive: true,
      });
      const reportDuration = async () => {
        try {
          const d = await player.getDuration();
          if (destroyed) return;
          if (Number.isFinite(d) && d > 0) {
            onDurationRef.current?.(d);
          }
        } catch {
          /* ignore */
        }
      };

      try {
        await player.ready();
        const iframe = await player.getIframe();
        if (iframe && !destroyed) {
          iframe.setAttribute("style", "position:absolute;inset:0;width:100%;height:100%;");
        }
        await reportDuration();
        player.on("loaded", reportDuration);
      } catch {
        /* ignore */
      }
      if (startSeconds > 0) {
        try {
          await player.setCurrentTime(startSeconds);
        } catch {
          /* ignore */
        }
      }
      player.on("timeupdate", (e: { seconds: number }) => {
        const now = Date.now();
        if (now - lastEmitRef.current < 15000) return;
        lastEmitRef.current = now;
        onTimeUpdate?.(e.seconds);
      });
      player.on("ended", () => onEnded?.());
    })();

    return () => {
      destroyed = true;
      if (player && typeof player.destroy === "function") {
        player.destroy().catch(() => {});
      }
    };
  }, [videoId, onTimeUpdate, onEnded, startSeconds]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {/** Outer box sets size; inner div is the Vimeo mount point and fills it. */}
      <div ref={containerRef} className="absolute inset-0 h-full w-full min-h-0" />
    </div>
  );
}
