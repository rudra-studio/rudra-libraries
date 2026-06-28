import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ParallaxScrubConfig {
  trigger: HTMLElement;
  target: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>;
  speed?: number; 
  smoothScrub?: boolean | number;
  /** When to start the animation. Default: "top bottom" (enters screen) */
  start?: string; 
  /** When to end the animation. Default: "bottom top" (leaves screen) */
  end?: string;
  /** Renders visual lines on the screen so you can see exactly where the triggers are */
  markers?: boolean; 
}

const createParallaxScrub = ({
  trigger,
  target,
  speed = -50,
  smoothScrub = 1,
  start = 'top bottom',
  end = 'bottom top',
  markers = false,
}: ParallaxScrubConfig): (() => void) => {
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: start,
      end: end,
      scrub: smoothScrub,
      markers: markers, // Turns on visual debugging
    },
  });

  tl.fromTo(
    target,
    { yPercent: -speed },
    { yPercent: speed, ease: 'none' } 
  );

  return () => {
    tl.kill(); 
    ScrollTrigger.getAll().forEach((st) => {
      if (st.animation === tl) st.kill();
    });
  };
};

export default createParallaxScrub;