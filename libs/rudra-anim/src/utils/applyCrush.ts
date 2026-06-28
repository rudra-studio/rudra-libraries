import gsap from 'gsap';

export interface ApplyCrushArgs {
  target: Element | string| null;
  duration?: number;
}

const applyCrush = ({ target, duration = 1 }: ApplyCrushArgs) => {
  if (!target) return;
  console.log("Applying Crush")
  gsap.killTweensOf(target);
  const tl = gsap.timeline();
  tl.to(target, {
    scaleX: 0.8,
    scaleY: 0.9,
    skewX: 10,
    skewY: -10,
    duration: duration * 0.2,
    ease: "power1.in"
  })
  .to(target, {
    scale: 0.2,
    rotation: 45,
    opacity: 0,
    filter: "blur(4px)",
    duration: duration * 0.8,
    ease: "power3.in"
  });
  
  return tl;
};

export default applyCrush;