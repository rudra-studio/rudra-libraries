import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface GsapStoryboardProps {
  children: React.ReactNode;
  scrollDistance?: string;
  storyboardStep?: {
  method: AnimationMethod;
  target: string; // The CSS selector (e.g., '.lid')
  vars: gsap.TweenVars; // The GSAP animation object
  position?: string | number; // The "position parameter" (e.g., '<', '+=0.5')
}
  storyboard: (tl: gsap.core.Timeline, container: HTMLElement) => void;
}

 const GsapStoryboard = ({ 
  children, 
  scrollDistance = "+=300%", 
  storyboard  = (tl) => {
    tl.to('.lid', { rotateX: 120 })
      .to('.left-bud', { x: -50 }, "<")
      .to('.right-bud', { x: 50 }, "<");
  }
}: GsapStoryboardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // useGSAP is GreenSock's official React wrapper—it auto-kills itself on unmount!
  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: "top top",
        end: scrollDistance,
        scrub: 1,
      }
    });

    storyboard(tl, containerRef.current);
  }, { scope: containerRef }); // "scope" guarantees GSAP selectors only look inside this div

  return <div ref={containerRef} className="w-full relative">{children}</div>;
};

export default GsapStoryboard;