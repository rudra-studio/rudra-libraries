import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type AudioSpectrumMode = "bars" | "wave" | "orb";

export interface AudioSpectrumProps {
  stream?: MediaStream | null;
  mode?: AudioSpectrumMode;
  color?: string;
  background?: string;
  sensitivity?: number;
  autoListen?: boolean;
  showLevel?: boolean;
  label?: string;
  className?: string;
  onLevelChange?: (level: number) => void;
  onError?: (message: string) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  return { width: canvas.width, height: canvas.height, ratio };
}

export default function AudioSpectrum({
  stream = null,
  mode = "bars",
  color = "#8b5cf6",
  background = "transparent",
  sensitivity = 1.25,
  autoListen = false,
  showLevel = true,
  label = "Live audio",
  className = "",
  onLevelChange,
  onError,
}: AudioSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ownedStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(stream);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<"idle" | "listening" | "error">("idle");

  const stop = useCallback(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    ownedStreamRef.current?.getTracks().forEach((track) => track.stop());
    ownedStreamRef.current = null;
    if (!stream) setActiveStream(null);
    setStatus("idle");
    setLevel(0);
  }, [stream]);

  const listen = useCallback(async () => {
    if (stream) {
      setActiveStream(stream);
      setStatus("listening");
      return;
    }
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      ownedStreamRef.current = microphone;
      setActiveStream(microphone);
      setStatus("listening");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Microphone access failed.";
      setStatus("error");
      onError?.(message);
    }
  }, [onError, stream]);

  useEffect(() => {
    setActiveStream(stream);
    if (stream) setStatus("listening");
  }, [stream]);

  useEffect(() => {
    if (autoListen) void listen();
    return stop;
  }, [autoListen, listen, stop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeStream) return;

    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      setStatus("error");
      onError?.("Web Audio API is not supported in this browser.");
      return;
    }

    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.82;
    const source = context.createMediaStreamSource(activeStream);
    source.connect(analyser);
    audioContextRef.current = context;

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const waveformData = new Uint8Array(analyser.fftSize);
    const draw = () => {
      const drawing = canvas.getContext("2d");
      if (!drawing) return;
      const { width, height } = resizeCanvas(canvas);
      drawing.clearRect(0, 0, width, height);
      drawing.fillStyle = background;
      drawing.fillRect(0, 0, width, height);

      analyser.getByteFrequencyData(frequencyData);
      const average = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
      const nextLevel = clamp((average / 255) * sensitivity, 0, 1);
      setLevel(nextLevel);
      onLevelChange?.(nextLevel);

      drawing.fillStyle = color;
      drawing.strokeStyle = color;
      drawing.lineWidth = Math.max(2, width / 320);

      if (mode === "bars") {
        const gap = Math.max(2, width / 180);
        const barWidth = Math.max(2, width / frequencyData.length - gap);
        frequencyData.forEach((value, index) => {
          const normalized = clamp((value / 255) * sensitivity, 0.02, 1);
          const barHeight = normalized * height * 0.86;
          const x = index * (barWidth + gap);
          drawing.globalAlpha = 0.35 + normalized * 0.65;
          drawing.fillRect(x, height - barHeight, barWidth, barHeight);
        });
        drawing.globalAlpha = 1;
      } else if (mode === "wave") {
        analyser.getByteTimeDomainData(waveformData);
        drawing.beginPath();
        waveformData.forEach((value, index) => {
          const x = (index / (waveformData.length - 1)) * width;
          const y = (value / 255) * height;
          if (index === 0) drawing.moveTo(x, y);
          else drawing.lineTo(x, y);
        });
        drawing.stroke();
      } else {
        const radius = Math.min(width, height) * (0.12 + nextLevel * 0.3);
        const gradient = drawing.createRadialGradient(
          width / 2, height / 2, 0,
          width / 2, height / 2, radius,
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        drawing.fillStyle = gradient;
        drawing.beginPath();
        drawing.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        drawing.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      source.disconnect();
      analyser.disconnect();
      void context.close();
    };
  }, [activeStream, background, color, mode, onError, onLevelChange, sensitivity]);

  return (
    <section className={`${styles.root} ${className}`} aria-label={label}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Audio intelligence</p>
          <h3 className={styles.title}>{label}</h3>
        </div>
        <div className={styles.status} data-status={status}>
          <span />
          {status === "listening" ? "Listening" : status}
        </div>
      </header>

      <div className={styles.visualizer}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {status !== "listening" && (
          <button type="button" className={styles.listenButton} onClick={() => void listen()}>
            Enable microphone
          </button>
        )}
      </div>

      {showLevel && (
        <div className={styles.meter} aria-label={`Audio level ${Math.round(level * 100)} percent`}>
          <span style={{ width: `${Math.round(level * 100)}%` }} />
        </div>
      )}

      {status === "listening" && !stream && (
        <button type="button" className={styles.stopButton} onClick={stop}>
          Stop listening
        </button>
      )}
    </section>
  );
}