export interface GetThemeStatusProps {
  /** 
   * The ID of the specific element to check. 
   * Useful if your builder canvas is isolated from the main app UI.
   */
  targetId?: string;
  /** 
   * The class name used to identify dark mode (default: 'dark') 
   */
  darkClassName?: string;
  /** 
   * The fallback theme if running on the server 
   */
  fallback?: 'light' | 'dark';
}

export default function GetThemeStatus({
  targetId,
  darkClassName = 'dark',
  fallback = 'light'
}: GetThemeStatusProps = {}): 'light' | 'dark' {
  // SSR Safety
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback;
  }

  try {
    // 1. Check a specific element and its parents (CSS Cascade logic)
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        // .closest() checks the element itself AND bubbles up to check all parents
        if (element.closest(`.${darkClassName}`)) {
          return 'dark';
        }
      }
    } 
    // 2. If no ID provided, fallback to standard global DOM checks
    else if (
      document.documentElement.classList.contains(darkClassName) ||
      document.body.classList.contains(darkClassName)
    ) {
      return 'dark';
    }

    // 3. Ultimate fallback: Check OS/System preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  } catch (error) {
    console.error('Failed to get theme status:', error);
    return fallback;
  }
}