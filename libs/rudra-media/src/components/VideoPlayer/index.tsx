import React from "react";

export interface VideoPlayerProps {
  url?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: 'video' | 'square' | 'auto';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function VideoPlayer({
  url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  aspectRatio = "video",
  radius = "xl",
  width,
  height
}: VideoPlayerProps) {

  const radiusClass = radius === "none" ? "rounded-none" : `rounded-${radius}`;
  const aspectClass = aspectRatio === "video" ? "aspect-video" : 
                      aspectRatio === "square" ? "aspect-square" : 
                      "aspect-auto";

  // 1. URL Parsers
  const getYoutubeId = (targetUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = targetUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoId = (targetUrl: string) => {
    const match = targetUrl.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
    return match ? match[1] : null;
  };

  const ytId = getYoutubeId(url);
  const vimeoId = !ytId ? getVimeoId(url) : null;

  // 2. Render Engine
  const renderVideo = () => {
    if (ytId) {
      const params = new URLSearchParams({
        controls: controls ? "1" : "0",
        autoplay: autoPlay ? "1" : "0",
        mute: (muted || autoPlay) ? "1" : "0",
        playsinline: "1",
        ...(loop && { loop: "1", playlist: ytId })
      });

      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?${params.toString()}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      );
    }

    if (vimeoId) {
      const params = new URLSearchParams({
        autoplay: autoPlay ? "1" : "0",
        loop: loop ? "1" : "0",
        muted: (muted || autoPlay) ? "1" : "0",
        controls: controls ? "1" : "0",
        dnt: "1"
      });

      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?${params.toString()}`}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      );
    }

    return (
      <video
        src={url}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted || autoPlay}
        playsInline
        className="absolute inset-0 w-full h-full object-cover bg-black"
      />
    );
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-900 shadow-lg flex items-center justify-center 
      ${radiusClass} ${aspectClass} 
      ${!width ? 'min-w-[320px]' : ''} w-full`}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {renderVideo()}
    </div>
  );
}