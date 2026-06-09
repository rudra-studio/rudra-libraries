import React from "react";

export interface VideoPlayerProps {
  url?: string; 
  controls?: boolean; 
  autoPlay?: boolean; 
  loop?: boolean; 
  muted?: boolean; 
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
  radius = "xl" 
}: VideoPlayerProps) {
  
  const radiusClass = radius === "none" ? "rounded-none" : `rounded-${radius}`;
  const aspectClass = 
    aspectRatio === "video" ? "aspect-video" : 
    aspectRatio === "square" ? "aspect-square" : 
    "aspect-auto";

  // 1. Smart YouTube URL Parser
  const getYoutubeId = (targetUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = targetUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 2. Smart Vimeo URL Parser
  const getVimeoId = (targetUrl: string) => {
    const match = targetUrl.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
    return match ? match[1] : null;
  };

  const ytId = getYoutubeId(url);
  const vimeoId = !ytId ? getVimeoId(url) : null;

  // 3. Native Render Engine
  const renderVideo = () => {
    if (ytId) {
      // Safely build URL parameters to prevent Error 153
      const params = new URLSearchParams({
        controls: controls ? "1" : "0",
        autoplay: autoPlay ? "1" : "0",
        mute: muted || autoPlay ? "1" : "0",
        playsinline: "1"
      });

      // YouTube strictly requires 'playlist' to equal the video ID to loop
      if (loop) {
        params.append("loop", "1");
        params.append("playlist", ytId);
      }

      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?${params.toString()}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      );
    }

    if (vimeoId) {
      const params = new URLSearchParams({
        autoplay: autoPlay ? "1" : "0",
        loop: loop ? "1" : "0",
        muted: muted || autoPlay ? "1" : "0",
        controls: controls ? "1" : "0",
        dnt: "1" // Do Not Track (bypasses some browser privacy blockers)
      });

      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?${params.toString()}`}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      );
    }

    // 4. Fallback to Native HTML5 Video for standard files (.mp4, .webm, etc.)
    return (
      <video
        src={url}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted || autoPlay} 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover bg-black"
      />
    );
  };

  return (
    <div className={`relative w-full overflow-hidden bg-slate-900 shadow-lg flex items-center justify-center ${radiusClass} ${aspectClass}`}>
      {renderVideo()}
    </div>
  );
}