export interface IsEqualProps {
  source: any;
  target: any;
}

export default function IsEqual({ source: a, target: b }: IsEqualProps): boolean {
  // 1. Strict equality (handles primitives and exact object references)
  if (a === b) return true;

  // 2. Handle null or undefined immediately to prevent typeof errors
  if (a === null || b === null || a === undefined || b === undefined) {
    return false;
  }

  // 3. If they aren't both objects at this point, they aren't equal
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // 4. Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 5. Handle Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      // Recursive call using the exact same interface
      if (!IsEqual({ a: a[i], b: b[i] })) return false;
    }
    return true;
  }

  // 6. Handle plain Objects
  if (!Array.isArray(a) && !Array.isArray(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key) || !IsEqual({ a: a[key], b: b[key] })) {
        return false;
      }
    }
    return true;
  }

  // Fallback for any other unmatched types (e.g., one is an array, one is an object)
  return false;
}