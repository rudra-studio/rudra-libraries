// components/SpriteAnimation/index.tsx
import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import styles from './styles.module.scss';
import { motion } from 'motion';

export interface SpriteAnimationProps {
  /** URL of the sprite sheet image. */
  spriteSheetUrl: string;
  /** Number of rows in the sprite sheet. */
  rows: number;
  /** Number of columns in the sprite sheet. */
  columns: number;
  /** Start frame index. @default 0 */
  startFrame?: number;
  /** End frame index. @default -1 (last frame) */
  endFrame?: number;
  /** Name of the currently active animation. @translate @select|idle|walk|run|jump */
  animation?: string;
  /** Frames per second for the active animation. @default 10 */
  fps?: number;
  /** Whether the active animation should loop. @default true */
  loop?: boolean;
  /** Whether the active animation should play in reverse. @default false */
  reverse?: boolean;
  /** Callback invoked when the active animation completes. @nodeFunction */
  onComplete?: (animationName: string) => void;
  /** Optional fallback frame index to display if the animation name is invalid. @default 0 */
  fallbackFrame?: number;
  /** Whether to pause the animation when the component is not in the viewport. @default true */
  pauseOnScroll?: boolean;
  /** Whether the animation should stop on the final frame when not looping. @default true */
  stopOnLastFrame?: boolean;
  /** Whether to pause the animation when it is disabled. @default true */
  pauseWhenDisabled?: boolean;
}

const SpriteAnimation: React.FC<SpriteAnimationProps> = ({
  spriteSheetUrl,
  rows,
  columns,
  startFrame = 0,
  endFrame = -1,
  animation = 'idle',
  fps = 10,
  loop = true,
  reverse = false,
  onComplete = () => {},
  fallbackFrame = 0,
  pauseOnScroll = true,
  stopOnLastFrame = true,
  pauseWhenDisabled = true,
}) => {
  const spriteRef = useRef<HTMLDivElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const [isPaused, setIsPaused] = useState(false);
  const [totalFrames, setTotalFrames] = useState(rows * columns);
  const frameDuration = 1000 / fps;
  const animationName = animation.trim().toLowerCase();
  const animationFrames: number[] = [];
  const [animationDuration, setAnimationDuration] = useState(0);
  const [animationLoop, setAnimationLoop] = useState(loop);
  const [animationReverse, setAnimationReverse] = useState(reverse);

  useLayoutEffect(() => {
    const frames = Array.from({ length: totalFrames }, (_, i) => i);
    animationFrames.push(...frames);
    if (endFrame !== -1) {
      animationFrames.length = endFrame - startFrame + 1;
    }
  }, [rows, columns, startFrame, endFrame, totalFrames]);

  useEffect(() => {
    if (spriteRef.current) {
      const spriteImage = new Image();
      spriteImage.src = spriteSheetUrl;
      spriteImage.onload = () => {
        setTotalFrames(spriteImage.naturalWidth / spriteImage.naturalHeight);
      };
    }
  }, [spriteSheetUrl]);

  useEffect(() => {
    if (!animationName) {
      setCurrentFrame(startFrame);
      setAnimationLoop(true);
      setAnimationReverse(false);
      setAnimationDuration(0);
      return;
    }

    const selectedFrames = animationFrames.filter((frame) =>
      (frame >= startFrame && frame <= endFrame) || (frame <= startFrame && frame >= endFrame)
    );

    if (animationReverse) {
      selectedFrames.reverse();
    }

    setAnimationLoop(loop);
    setAnimationReverse(reverse);
    setAnimationDuration(selectedFrames.length * frameDuration);
  }, [animationName, animationFrames, loop, reverse, frameDuration, startFrame, endFrame]);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let loopCount = 0;

    if (!isPaused) {
      animationFrameId = requestAnimationFrame(() => {
        if (currentFrame < animationFrames.length - 1) {
          setCurrentFrame(currentFrame + 1);
        } else {
          if (animationLoop) {
            setCurrentFrame(0);
            loopCount++;
          } else {
            onComplete(animationName);
          }
        }
      });
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentFrame, animationFrames, isPaused, animationLoop, onComplete, animationName, reverse, frameDuration]);

  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.style.backgroundImage = `url(${spriteSheetUrl})`;
      spriteRef.current.style.backgroundSize = `${totalFrames * 100}% ${100}%`;
    }
  }, [spriteSheetUrl, totalFrames]);

  useEffect(() => {
    if (!spriteRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsPaused(entry.isIntersecting ? false : pauseOnScroll);
      });
    }, { threshold: 0.1 });

    observer.observe(spriteRef.current);

    return () => {
      observer.disconnect();
    };
  }, [pauseOnScroll]);

  useEffect(() => {
    setIsPaused(pauseWhenDisabled);
  }, [pauseWhenDisabled]);

  return (
    <div ref={spriteRef} className={styles.spriteContainer} style={{
      width: `${100 / columns}%`,
      height: `${100 / rows}%`,
      backgroundPosition: `-${(currentFrame % columns) * 100}% -${Math.floor(currentFrame / columns) * 100}%`,
    }}></div>
  );
};

export default SpriteAnimation;