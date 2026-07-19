export interface SetLocalStorageProps {
  key: string;
  value: any;
}

export default function SetLocalStorage({ key, value }: SetLocalStorageProps): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Stringify objects/arrays, keep strings as strings if preferred
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage:`, error);
    return false;
  }
}