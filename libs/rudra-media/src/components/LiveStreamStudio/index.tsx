import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type LiveStreamSource = "camera" | "screen";
export type LiveStreamStatus = "idle" | "preview" | "live" | "error";

export interface LiveStreamStudioProps {
  title?: string;
  source?: LiveStreamSource;
  includeMicrophone?: boolean;
  facingMode?: "user" | "environment";
  showRecording?: boolean;
  className?: string;
  onStreamChange?: (stream: MediaStream | null) => void;
  onLiveChange?: (isLive: boolean) => void;
  onRecordingReady?: (blob: Blob) => void;
  onError?: (message: string) => void;
}

function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function supportedRecorderType() {
  return [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

async function requestStudioStream(
  source: LiveStreamSource,
  includeMicrophone: boolean,
  facingMode: "user" | "environment",
) {
  if (source === "camera") {
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: includeMicrophone,
    });
  }

  const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  if (!includeMicrophone) return display;
  try {
    const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphone.getAudioTracks().forEach((track) => display.addTrack(track));
  } catch {
    // The display stream remains useful if microphone permission is declined.
  }
  return display;
}

export default function LiveStreamStudio({
  title = "Live Stream Studio",
  source = "camera",
  includeMicrophone = true,
  facingMode = "user",
  showRecording = true,
  className = "",
  onStreamChange,
  onLiveChange,
  onRecordingReady,
  onError,
}: LiveStreamStudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [status, setStatus] = useState<LiveStreamStatus>("idle");
  const [message, setMessage] = useState("Choose a source to begin.");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }, []);

  const stopPreview = useCallback(() => {
    stopRecording();
    stopTracks(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setElapsed(0);
    onStreamChange?.(null);
    onLiveChange?.(false);
  }, [onLiveChange, onStreamChange, stopRecording]);

  const startPreview = useCallback(async () => {
    if (!navigator.mediaDevices) {
      const nextMessage = "Media capture is not supported in this browser.";
      setStatus("error");
      setMessage(nextMessage);
      onError?.(nextMessage);
      return;
    }
    try {
      stopTracks(streamRef.current);
      const stream = await requestStudioStream(source, includeMicrophone, facingMode);
      streamRef.current = stream;
      stream.getVideoTracks()[0]?.addEventListener("ended", stopPreview, { once: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("preview");
      setMessage("Preview ready");
      onStreamChange?.(stream);
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Unable to start preview.";
      setStatus("error");
      setMessage(nextMessage);
      onError?.(nextMessage);
    }
  }, [facingMode, includeMicrophone, onError, onStreamChange, source, stopPreview]);

  const toggleLive = () => {
    if (!streamRef.current) return;
    const next = status !== "live";
    setStatus(next ? "live" : "preview");
    setElapsed(0);
    onLiveChange?.(next);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") {
      setMessage("Recording is not supported in this browser.");
      return;
    }
    chunksRef.current = [];
    const mimeType = supportedRecorderType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
      setIsRecording(false);
      if (onRecordingReady) {
        onRecordingReady(blob);
      } else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `live-session-${Date.now()}.webm`;
        anchor.click();
        URL.revokeObjectURL(url);
      }
    };
    recorder.start(1000);
    setIsRecording(true);
  };

  useEffect(() => {
    if (status !== "live") return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => stopPreview, [stopPreview]);

  const elapsedLabel = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <section className={`${styles.root} ${className}`} aria-label={title}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Creator tools</p>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.liveStatus} data-live={status === "live"}>
          <span />
          {status === "live" ? `LIVE · ${elapsedLabel}` : status.toUpperCase()}
        </div>
      </header>

      <div className={styles.stage}>
        <video ref={videoRef} autoPlay muted playsInline className={styles.video} />
        {status === "idle" || status === "error" ? (
          <div className={styles.emptyState}>
            <strong>{source === "screen" ? "Share your screen" : "Open your camera"}</strong>
            <span>{message}</span>
          </div>
        ) : null}
        {isRecording && <div className={styles.recordingBadge}>● REC</div>}
        <div className={styles.signalBars} aria-label="Connection quality: excellent">
          <i /><i /><i /><i />
        </div>
      </div>

      <div className={styles.controls}>
        {!streamRef.current ? (
          <button type="button" className={styles.primaryButton} onClick={() => void startPreview()}>
            Start preview
          </button>
        ) : (
          <>
            <button type="button" className={styles.liveButton} data-live={status === "live"} onClick={toggleLive}>
              {status === "live" ? "End live" : "Go live"}
            </button>
            {showRecording && (
              <button type="button" className={styles.secondaryButton} onClick={toggleRecording}>
                {isRecording ? "Stop recording" : "Record"}
              </button>
            )}
            <button type="button" className={styles.secondaryButton} onClick={stopPreview}>
              Close studio
            </button>
          </>
        )}
      </div>
    </section>
  );
}