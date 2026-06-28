import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface StreamPlayerProps {
  stream: MediaStream | null;
  status: 'idle' | 'connecting' | 'live' | 'error';
  controls?: React.ReactNode; // Injected button slots
  overlay?: React.ReactNode;  // Custom UI (e.g. "Waiting for host")
  className?: string;
}

export default function StreamPlayer({
  stream,
  status,
  controls,
  overlay,
  className = ''
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* 1. The Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* 2. Visual State Overlays (Connecting/Error) */}
      <AnimatePresence mode="wait">
        {status !== 'live' && (
          <motion.div
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10"
          >
            {status === 'connecting' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full"
              />
            )}
            {overlay}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The Control Slot (Always visible or toggleable) */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
        {controls}
      </div>
    </div>
  );
}