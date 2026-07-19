export interface GetLocalStorageProps {
  key: string;
  /** What to return if the key doesn't exist or parsing fails */
  fallback?: any; 
}

export default function GetLocalStorage({ key, fallback = null }: GetLocalStorageProps): any {
  if (typeof window === 'undefined') return fallback;

  try {
    const item = window.localStorage.getItem(key);
    
    if (item === null) return fallback;

    // Safely attempt to parse JSON. If it's just a raw string, return the string.
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage:`, error);
    return fallback;
  }
}