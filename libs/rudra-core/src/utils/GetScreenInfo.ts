export interface GetScreenInfoProps {
  /** Override the max-width for mobile devices (default: 768) */
  mobileBreakpoint?: number;
  /** Override the max-width for tablet devices (default: 1024) */
  tabletBreakpoint?: number;
}

export interface ScreenInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

export default function GetScreenInfo({ 
  mobileBreakpoint = 768, 
  tabletBreakpoint = 1024 
}: GetScreenInfoProps = {}): ScreenInfo {
  
  // 1. SSR Fallback (Crucial for Next.js)
  // If this runs on the server before the client loads, default to desktop dimensions
  if (typeof window === 'undefined') {
    return {
      width: 1440,
      height: 900,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      orientation: 'landscape'
    };
  }

  // 2. Client-side evaluation
  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    isMobile: width < mobileBreakpoint,
    isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
    isDesktop: width >= tabletBreakpoint,
    orientation: height > width ? 'portrait' : 'landscape'
  };
}