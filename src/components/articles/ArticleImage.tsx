import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ArticleImageProps {
  readonly src?: string | null;
  readonly alt: string;
  readonly className?: string;
}

export default function ArticleImage({
  src,
  alt,
  className = "",
}: ArticleImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setShowFallback(false);
    setHasError(false);

    const fallbackTimer = window.setTimeout(() => {
      setShowFallback(true);
    }, 1500);

    return () => window.clearTimeout(fallbackTimer);
  }, [src]);

  // No image URL was provided
  const hasImage = Boolean(src && src.trim() !== "");

  // If there is no image, directly show placeholder
  if (!hasImage) {
    return (
      <img
        src="/images/placeholder.jpg"
        alt={alt}
        className={className}
      />
    );
  }

  if (hasError) {
    return (
      <img
        src="/images/placeholder.jpg"
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={src!}
        alt={alt}
        className={className}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        quality={75}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setShowFallback(true);
        }}
      />
      {showFallback && !isLoaded && (
        <img
          src="/images/placeholder.jpg"
          alt={alt}
          className={`${className} absolute inset-0`}
        />
      )}
    </div>
  );
}
