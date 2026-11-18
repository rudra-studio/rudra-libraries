import { motion } from 'motion';

export const ANIMATION_FRAME_DEFAULTS = {
  startFrame: 0,
  endFrame: 0,
  frameRate: 10,
  direction: 1,
  loop: false
};

type AnimationFrameConfig = Partial<typeof ANIMATION_FRAME_DEFAULTS>;

type AnimationConfig = {
  name: string;
  frames: number[];
  frameRate: number;
  direction: number;
  loop: boolean;
};

type SpriteAnimationProps = {
  spriteSrc: string;
  animations: AnimationConfig[];
  currentAnimation: string;
  animationFrameConfig: AnimationFrameConfig;
};

const spriteAnimation = ({
  spriteSrc,
  animations,
  currentAnimation,
  animationFrameConfig = ANIMATION_FRAME_DEFAULTS
}: SpriteAnimationProps) => {
  const { frames, frameRate, direction, loop } = animations.find(
    (anim) => anim.name === currentAnimation
  ) || ANIMATION_FRAME_DEFAULTS;

  const frame = Math.floor(
    (Date.now() / 1000) * frameRate * direction % frames.length
  );

  return {
    backgroundImage: `url(${spriteSrc})`,
    backgroundPosition: `-${frame * (100 / frames.length)}% 0`,
    width: `${100 / frames.length}%`,
    animationFrameConfig,
    frameRate,
    direction,
    loop
  };
};

export { spriteAnimation };