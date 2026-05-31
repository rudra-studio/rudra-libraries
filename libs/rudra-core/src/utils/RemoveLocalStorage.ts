interface RemoveLocalStorageProps {
  key: string;
}

export default function RemoveLocalStorage({ key }: RemoveLocalStorageProps): void {
  // Utility function logic here
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key "${key}":`, error);
  }
}