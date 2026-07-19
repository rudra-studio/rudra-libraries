export interface SetCookieProps {
  name: string;
  value: any;
  /** Expiration time in days. If undefined, it becomes a session cookie (deletes on browser close) */
  days?: number;
  /** The URL path the cookie is valid for (default: '/') */
  path?: string;
  /** If true, cookie is only sent over HTTPS (default: true in production) */
  secure?: boolean;
  /** Cross-origin policy (default: 'Lax') */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export default function SetCookie({ 
  name, 
  value, 
  days, 
  path = '/', 
  secure = true, 
  sameSite = 'Lax' 
}: SetCookieProps): boolean {
  
  if (typeof document === 'undefined') return false;

  try {
    // Stringify objects/arrays safely
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(serializedValue)}; path=${path}; SameSite=${sameSite}`;

    if (days !== undefined) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    }

    if (secure || sameSite === 'None') {
      cookieString += '; Secure';
    }

    document.cookie = cookieString;
    return true;
  } catch (error) {
    console.error(`Failed to set cookie "${name}":`, error);
    return false;
  }
}