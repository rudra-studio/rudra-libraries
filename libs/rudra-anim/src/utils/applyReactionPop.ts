import gsap from 'gsap';

export interface ApplyReactionPopArgs {
  container: Element | null;
  emojis?: string[];
  duration?: number;
  origin?: 'bottom-right' | 'bottom-left' | 'center';
}

const applyReactionPop = ({ 
  container, 
  emojis = ['❤️', '🔥', '🚀'], 
  duration = 1.5, 
  origin = 'center' 
}: ApplyReactionPopArgs) => {
  if (!container) return;
  
  const tl = gsap.timeline();
  
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.position = 'absolute';
    el.style.fontSize = '24px';
    el.style.userSelect = 'none';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '50';
    
    if (origin === 'bottom-right') {
      el.style.bottom = '10px';
      el.style.right = '10px';
    } else if (origin === 'bottom-left') {
      el.style.bottom = '10px';
      el.style.left = '10px';
    } else {
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%)';
    }
    
    container.appendChild(el);

    const randomX = (Math.random() - (origin.includes('right') ? 1 : 0.5)) * 200;
    const randomY = (Math.random() - 1) * 300; 
    const randomRot = (Math.random() - 0.5) * 360;

    tl.fromTo(el, 
      { opacity: 1, scale: 0 },
      {
        x: randomX,
        y: randomY,
        rotation: randomRot,
        scale: Math.random() * 1.5 + 0.5,
        opacity: 0,
        duration: duration + (Math.random() * 0.5),
        ease: "power2.out",
        onComplete: () => el.remove() 
      },
      0 
    );
  }
  return tl;
};

export default applyReactionPop;