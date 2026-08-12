import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type ARCameraMode = "reticle" | "grid" | "face-guide";
export type CameraFacingMode = "user" | "environment";

export interface ARCameraViewProps {
  facingMode?: CameraFacingMode;
  overlayMode?: ARCameraMode;
  autoStart?: boolean;
  enableAudio?: boolean;
  mirrored?: boolean;
  showControls?: boolean;
  captureLabel?: string;
  className?: string;
  onStreamReady?: (stream: MediaStream) => void;
  onCapture?: (blob: Blob) => void;
  onError?: (message: string) => void;
}

function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function cameraConstraints(facingMode: CameraFacingMode, enableAudio: boolean): MediaStreamConstraints {
  return {
    audio: enableAudio,
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  };
}

export default function ARCameraView({
  facingMode = "environment",
  overlayMode = "reticle",
  autoStart = false,
  enableAudio = false,
  mirrored = false,
  showControls = true,
  captureLabel = "Capture",
  className = "",
  onStreamReady,
  onCapture,
  onError,
}: ARCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"idle" | "requesting" | "ready" | "error">("idle");
  const [message, setMessage] = useState("Camera is ready when you are");
  const [torchEnabled, setTorchEnabled] = useState(false);

  const stop = useCallback(() => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setTorchEnabled(false);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const nextMessage = "Camera access is not supported in this browser.";
      setMessage(nextMessage);
      setStatus("error");
      onError?.(nextMessage);
      return;
    }

    setStatus("requesting");
    setMessage("Requesting camera permission…");
    try {
      stopMediaStream(streamRef.current);
      const stream = await navigator.mediaDevices.getUserMedia(
        cameraConstraints(facingMode, enableAudio),
      );
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
      setMessage("Camera connected");
      onStreamReady?.(stream);
    } catch (error) {
      const nextMessage =
        error instanceof Error ? error.message : "Unable to open the camera.";
      setStatus("error");
      setMessage(nextMessage);
      onError?.(nextMessage);
    }
  }, [enableAudio, facingMode, onError, onStreamReady]);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & {
      torch?: boolean;
    };
    if (!capabilities?.torch) {
      setMessage("Torch is not available on this camera.");
      return;
    }
    const next = !torchEnabled;
    await track.applyConstraints({
      advanced: [{ torch: next } as MediaTrackConstraintSet],
    });
    setTorchEnabled(next);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (mirrored) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (onCapture) {
        onCapture(blob);
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ar-capture-${Date.now()}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  useEffect(() => {
    if (autoStart) void start();
    return stop;
  }, [autoStart, start, stop]);

  return (
    <section className={`${styles.root} ${className}`} aria-label="AR camera">
      <div className={styles.viewport}>
        <video
          ref={videoRef}
          className={`${styles.video} ${mirrored ? styles.mirrored : ""}`}
          autoPlay
          muted
          playsInline
        />
        <div className={`${styles.overlay} ${styles[overlayMode]}`} aria-hidden="true">
          {overlayMode === "reticle" && <span className={styles.targetDot} />}
          {overlayMode === "face-guide" && <span className={styles.faceOval} />}
        </div>
        <div className={styles.status} data-status={status}>
          <span className={styles.statusDot} />
          {status === "ready" ? "AR camera live" : message}
        </div>
      </div>

      {showControls && (
        <div className={styles.controls}>
          {status !== "ready" ? (
            <button type="button" className={styles.primaryButton} onClick={() => void start()}>
              Enable camera
            </button>
          ) : (
            <>
              <button type="button" className={styles.primaryButton} onClick={capture}>
                {captureLabel}
              </button>
              <button type="button" className={styles.secondaryButton} onClick={() => void toggleTorch()}>
                {torchEnabled ? "Torch off" : "Torch"}
              </button>
              <button type="button" className={styles.secondaryButton} onClick={stop}>
                Stop
              </button>
            </>
          )}
        </div>
      )}
      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
    </section>
  );
}