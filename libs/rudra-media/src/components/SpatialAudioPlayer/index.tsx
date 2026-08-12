import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type SpatialAudioDistanceModel = "linear" | "inverse" | "exponential";

export interface SpatialAudioPlayerProps {
  src?: string;
  title?: string;
  artist?: string;
  artworkUrl?: string;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
  distanceModel?: SpatialAudioDistanceModel;
  roomSize?: number;
  className?: string;
  onPlayChange?: (playing: boolean) => void;
  onPositionChange?: (position: { x: number; y: number; z: number }) => void;
  onError?: (message: string) => void;
}

type Point3D = { x: number; y: number; z: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function setPannerPosition(panner: PannerNode, point: Point3D) {
  const now = panner.context.currentTime;
  if (panner.positionX) {
    panner.positionX.setTargetAtTime(point.x, now, 0.01);
    panner.positionY.setTargetAtTime(point.y, now, 0.01);
    panner.positionZ.setTargetAtTime(point.z, now, 0.01);
  } else {
    panner.setPosition(point.x, point.y, point.z);
  }
}

export default function SpatialAudioPlayer({
  src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  title = "Spatial Session",
  artist = "Rudra Media",
  artworkUrl,
  loop = true,
  autoPlay = false,
  volume = 0.8,
  distanceModel = "inverse",
  roomSize = 10,
  className = "",
  onPlayChange,
  onPositionChange,
  onError,
}: SpatialAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const pannerRef = useRef<PannerNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [position, setPosition] = useState<Point3D>({ x: 0, y: 0, z: -2 });
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const initializeAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || contextRef.current) return contextRef.current;
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      onError?.("Spatial audio is not supported in this browser.");
      return null;
    }

    const context = new AudioContextClass();
    const source = context.createMediaElementSource(audio);
    const panner = context.createPanner();
    const gain = context.createGain();
    panner.panningModel = "HRTF";
    panner.distanceModel = distanceModel;
    panner.refDistance = 1;
    panner.maxDistance = Math.max(2, roomSize);
    panner.rolloffFactor = 1;
    gain.gain.value = clamp(volume, 0, 1);
    setPannerPosition(panner, position);
    source.connect(panner).connect(gain).connect(context.destination);

    contextRef.current = context;
    sourceRef.current = source;
    pannerRef.current = panner;
    gainRef.current = gain;
    setReady(true);
    return context;
  }, [distanceModel, onError, position, roomSize, volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const context = initializeAudio();
    if (!context) return;
    if (context.state === "suspended") await context.resume();
    try {
      if (audio.paused) await audio.play();
      else audio.pause();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Unable to play audio.");
    }
  };

  const updatePosition = (axis: keyof Point3D, value: number) => {
    const next = { ...position, [axis]: value };
    setPosition(next);
    if (pannerRef.current) setPannerPosition(pannerRef.current, next);
    onPositionChange?.(next);
  };

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = clamp(volume, 0, 1);
  }, [volume]);

  useEffect(() => {
    if (pannerRef.current) {
      pannerRef.current.distanceModel = distanceModel;
      pannerRef.current.maxDistance = Math.max(2, roomSize);
    }
  }, [distanceModel, roomSize]);

  useEffect(() => {
    if (autoPlay) void togglePlay();
    return () => {
      void contextRef.current?.close();
      contextRef.current = null;
      sourceRef.current = null;
      pannerRef.current = null;
      gainRef.current = null;
    };
    // Auto-play is intentionally evaluated only when the source mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, src]);

  const visualX = clamp(50 + (position.x / Math.max(roomSize, 1)) * 50, 4, 96);
  const visualY = clamp(50 + (position.z / Math.max(roomSize, 1)) * 50, 4, 96);

  return (
    <section className={`${styles.root} ${className}`} aria-label={title}>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        crossOrigin="anonymous"
        onPlay={() => { setPlaying(true); onPlayChange?.(true); }}
        onPause={() => { setPlaying(false); onPlayChange?.(false); }}
        onError={() => onError?.("The audio source could not be loaded.")}
      />

      <div className={styles.identity}>
        <div className={styles.artwork}>
          {artworkUrl ? <img src={artworkUrl} alt="" /> : <span aria-hidden="true">◉</span>}
        </div>
        <div>
          <p className={styles.eyebrow}>{ready ? "HRTF spatial audio" : "3D audio player"}</p>
          <h3>{title}</h3>
          <p>{artist}</p>
        </div>
        <button type="button" className={styles.playButton} onClick={() => void togglePlay()}>
          <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
          <span className={styles.srOnly}>{playing ? "Pause" : "Play"}</span>
        </button>
      </div>

      <div className={styles.room} aria-label="Spatial sound position">
        <div className={styles.listener}>You</div>
        <button
          type="button"
          className={styles.soundPoint}
          style={{ left: `${visualX}%`, top: `${visualY}%` }}
          title={`Sound position x ${position.x}, z ${position.z}`}
          onClick={() => {
            const centered = { x: 0, y: 0, z: -2 };
            setPosition(centered);
            if (pannerRef.current) setPannerPosition(pannerRef.current, centered);
            onPositionChange?.(centered);
          }}
        >
          ♪
        </button>
        <span className={styles.orbit} />
        <span className={styles.orbitWide} />
      </div>

      <div className={styles.sliders}>
        {(["x", "y", "z"] as const).map((axis) => (
          <label key={axis}>
            <span>{axis.toUpperCase()} axis</span>
            <input
              type="range"
              min={-roomSize}
              max={roomSize}
              step={0.1}
              value={position[axis]}
              onChange={(event) => updatePosition(axis, Number(event.target.value))}
            />
            <output>{position[axis].toFixed(1)}</output>
          </label>
        ))}
      </div>
    </section>
  );
}