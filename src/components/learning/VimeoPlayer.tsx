"use client";

import { useEffect, useRef } from "react";

type Props = {
  videoId: string;
  onTimeUpdate?: (seconds: number) => void;
  onEnded?: () => void;
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
  const playerRef = useRef<any>(null);

  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);
  const onDurationRef = useRef(onDuration);

  onTimeUpdateRef.current = onTimeUpdate;
  onEndedRef.current = onEnded;
  onDurationRef.current = onDuration;

  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    let destroyed = false;

    const initPlayer = async () => {
      try {
        const { default: Player } = await import("@vimeo/player");

        const cleanVideoId = String(videoId).match(/\d+/)?.[0];

        if (!cleanVideoId) {
          console.error("Invalid Vimeo ID:", videoId);
          return;
        }

        // destroy previous player if exists
        if (playerRef.current) {
          try {
            await playerRef.current.destroy();
          } catch {
            //
          }
          playerRef.current = null;
        }

        const player = new Player(containerRef.current!, {
          id: Number(cleanVideoId),
          responsive: true,
          autoplay: false,
        });

        playerRef.current = player;

        await player.ready();

        if (destroyed) return;

        // console.log("Vimeo ready");

        // duration
        try {
          const duration = await player.getDuration();

          if (!destroyed && duration > 0) {
            onDurationRef.current?.(duration);
          }
        } catch (err) {
          console.error("Duration error:", err);
        }

        // seek
        if (startSeconds > 0) {
          try {
            await player.setCurrentTime(startSeconds);
          } catch (err) {
            console.error("Seek error:", err);
          }
        }

        let lastSent = 0;

        player.on("timeupdate", (event: any) => {
          const now = Date.now();

          if (now - lastSent < 15000) return;

          lastSent = now;

          onTimeUpdateRef.current?.(event.seconds);
        });

        player.on("ended", () => {
          onEndedRef.current?.();
        });

        player.on("error", (error: any) => {
          console.error("Vimeo Error:", error);
        });
      } catch (error) {
        console.error("Player initialization failed:", error);
      }
    };

    initPlayer();

    return () => {
      destroyed = true;

      const player = playerRef.current;

      if (player) {
        player
          .destroy()
          .catch(() => {})
          .finally(() => {
            playerRef.current = null;
          });
      }
    };
  }, [videoId]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}