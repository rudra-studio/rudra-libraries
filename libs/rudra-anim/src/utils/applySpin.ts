import gsap from 'gsap';

export interface ApplySpinArgs {
  target: Element | string| null;
  duration?: number;
}

const applySpin = ({ target, duration = 1 }: ApplySpinArgs) => {
  if (!target) return; // Safely handle React's initial null refs
  console.log("Applying Spin...")
  gsap.killTweensOf(target);
  return gsap.to(target, {
    rotation: "+=360",
    duration: duration,
    ease: "power2.inOut",
    transformOrigin: "center center"
  });
};

export default applySpin;