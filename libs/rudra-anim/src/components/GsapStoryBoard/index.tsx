import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export type AnimationMethod = 'to' | 'from' | 'fromTo' | 'set';

export interface StoryboardStep {
  method: AnimationMethod;
  target: string; // The CSS selector (e.g., '.lid')
  vars: gsap.TweenVars; // The GSAP animation object
  position?: string | number; // The "position parameter" (e.g., '<', '+=0.5')
}

export interface GsapStoryboardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  scrollDistance?: string;
  storyboardSteps?: StoryboardStep[]; // Expose a data-driven array of steps for the builder
  storyboard?: (tl: gsap.core.Timeline, container: HTMLElement) => void;
  
  /**
   * The Custom Attributes Dictionary
   * We use additionalProperties to tell the schema it's a dynamic key-value object
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<string, string>;

  /** * @type|class
   * @schema [{
   * "key": "Height",
   * "prefix": "min-h",
   * "type": "select",
   * "options": [
   * {"key": "screen", "label": "Full Screen (100vh)"},
   * {"key": "full", "label": "Full Height (100%)"},
   * {"key": "0", "label": "Auto"}
   * ]
   * },{
   * "key": "Width",
   * "prefix": "w",
   * "type": "select",
   * "options": [
   * {"key": "full", "label": "Full Width"},
   * {"key": "auto", "label": "Auto"}
   * ]
   * }]
   */
  className?: string;
}

export default function GsapStoryboard({ 
  children, 
  scrollDistance = "+=300%", 
  storyboardSteps = [],
  storyboard = (tl) => {
    // Default fallback animation if none provided
    tl.to('.lid', { rotateX: 120 })
      .to('.left-bud', { x: -50 }, "<")
      .to('.right-bud', { x: 50 }, "<");
  },
  customAttributes = {},
  // Add min-h-screen by default to ensure GSAP pinned containers don't collapse/jitter
  className = 'w-full relative min-h-screen',
  ...props
}: GsapStoryboardProps) {
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

    // If data-driven steps are provided from the schema builder, execute them
    if (storyboardSteps.length > 0) {
      storyboardSteps.forEach(step => {
        switch (step.method) {
          case 'to':
            tl.to(step.target, step.vars, step.position);
            break;
          case 'from':
            tl.from(step.target, step.vars, step.position);
            break;
          case 'set':
            tl.set(step.target, step.vars, step.position);
            break;
          default:
            break;
        }
      });
    } else {
      // Otherwise, fallback to the manual code function
      storyboard(tl, containerRef.current);
    }
  }, { scope: containerRef }); // "scope" guarantees GSAP selectors only look inside this div

  return (
    <div 
      ref={containerRef} 
      className={className} 
      {...customAttributes} 
      {...props}
    >
      {children}
    </div>
  );
}