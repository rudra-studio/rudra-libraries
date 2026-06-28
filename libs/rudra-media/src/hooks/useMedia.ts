// hooks/useMedia.ts
import { useState } from 'react';
import { createRecorder } from '../utils/createRecorder';
import { stopRecorder } from '../utils/stopRecorder';

export const useMediaRecorder = (stream: MediaStream | null) => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const start = (onComplete: (blob: Blob) => void) => {
    if (!stream) return;
    const newRecorder = createRecorder({stream, onComplete});
    newRecorder.start();
    setRecorder(newRecorder);
  };

  const stop = () => {
    if (recorder) stopRecorder({recorder});
  };

  return { start, stop, isRecording: !!recorder };
};