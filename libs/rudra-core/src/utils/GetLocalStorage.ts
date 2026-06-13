interface GetLocalStorageProps {
  key: string;
  defaultValue?: any;

}

export default function GetLocalStorage({ key, defaultValue }: GetLocalStorageProps): any {
  // Utility function logic here
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
}