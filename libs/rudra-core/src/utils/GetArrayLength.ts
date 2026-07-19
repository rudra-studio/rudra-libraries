export interface GetArrayLengthProps {
  /** The array (or string) to measure */
  target: any;
  /** What to return if the target is invalid */
  fallback?: number;
}

export default function GetArrayLength({
  target,
  fallback = 0
}: GetArrayLengthProps): number {
  if (target === null || target === undefined) return fallback;

  try {
    // Works for both Arrays and Strings
    if (Array.isArray(target) || typeof target === 'string') {
      return target.length;
    }

    // If it's an object, return the number of keys
    if (typeof target === 'object') {
      return Object.keys(target).length;
    }

    return fallback;
  } catch (error) {
    console.error('Failed to get length:', error);
    return fallback;
  }
}