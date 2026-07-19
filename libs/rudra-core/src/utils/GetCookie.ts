export interface GetCookieProps {
  name: string;
  /** What to return if the cookie doesn't exist */
  fallback?: any;
}

export default function GetCookie({ name, fallback = null }: GetCookieProps): any {
  if (typeof document === 'undefined') return fallback;

  try {
    const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(name) + '=([^;]+)'));

    if (!match) return fallback;

    const decodedValue = decodeURIComponent(match[2]);

    // Attempt to parse it as JSON in case it was an object/array
    try {
      return JSON.parse(decodedValue);
    } catch {
      return decodedValue; // It's just a regular string
    }
  } catch (error) {
    console.error(`Failed to read cookie "${name}":`, error);
    return fallback;
  }
}