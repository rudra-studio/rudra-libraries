import React, { useState, useCallback, useEffect } from 'react';
import StreamPlayer from '../StreamPlayer';
import useMediaRecorder  from '../../hooks/useMedia';

export default function CameraTest() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Hook in the recording logc
  const { start, stop, isRecording, recordedVideo } = useMediaRecorder(stream);

  const startCamera = async () => {
    setStatus('connecting');
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      setStatus('live');
    } catch (err: any) {
      setError('Could not access camera');
      setStatus('error');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      // Ensure we stop recording before stopping camera
      if (isRecording) stop();
      
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setStatus('idle');
    }
  }, [stream, isRecording, stop]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <StreamPlayer
        stream={stream}
        status={status}
        overlay={
          <div className="text-white text-center p-6">
            <p className="font-bold">{error || 'Camera is off'}</p>
            {status === 'idle' && (
              <button 
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Enable Camera
              </button>
            )}
          </div>
        }
        controls={
          status === 'live' && (
            <div className="flex gap-2">
              <button 
                onClick={isRecording ? stop : start}
                className={`px-6 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Record Video'}
              </button>
              <button 
                onClick={stopCamera}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
              >
                Stop Camera
              </button>
            </div>
          )
        }
      />

      {recordedVideo && (
        <div className="bg-slate-800 p-4 rounded-xl text-center">
          <p className="text-white mb-2">Recording Ready:</p>
          <a href={recordedVideo} download="video.webm" className="text-blue-400 underline">
            Download File
          </a>
        </div>
      )}
    </div>
  );
}