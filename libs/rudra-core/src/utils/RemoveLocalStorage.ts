export interface RemoveLocalStorageProps {
  key: string;
}

export default function RemoveLocalStorage({ key }: RemoveLocalStorageProps): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove "${key}" from localStorage:`, error);
    return false;
  }
}