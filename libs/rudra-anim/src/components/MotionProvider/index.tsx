import React from 'react';
import { MotionConfig } from 'motion/react';

export interface MotionProviderProps {
  children: React.ReactNode;
  /**
   * 'user': Respects the OS-level prefers-reduced-motion media query (Enterprise Default).
   * 'always': Forces all animations to degrade to simple crossfades (Great for low-power mode).
   * 'never': Forces full animations regardless of OS settings (Use with caution).
   */
  reducedMotion?: 'user' | 'always' | 'never'; /* @select|user|always|never */
}

export default function MotionProvider({
  children,
  reducedMotion = 'user',
}: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion={reducedMotion}>
      {children}
    </MotionConfig>
  );
}