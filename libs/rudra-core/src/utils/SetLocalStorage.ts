interface SetLocalStorageProps {
  key: string;
  value: any;
}

export default function SetLocalStorage({ key, value }: SetLocalStorageProps): void {
  // Utility function logic here
  if (typeof window === 'undefined') return;
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage for key "${key}":`, error);
  }
}interface SetLocalStorageProps {
  key: string;
  value: any;
}

export default function SetLocalStorage({ key, value }: SetLocalStorageProps): void {
  // Utility function logic here
  if (typeof window === 'undefined') return;
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage for key "${key}":`, error);
  }
}