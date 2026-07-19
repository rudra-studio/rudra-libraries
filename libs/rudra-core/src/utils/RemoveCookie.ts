export interface RemoveCookieProps {
  name: string;
  /** Path must match the path used when creating the cookie */
  path?: string;
}

export default function RemoveCookie({ name, path = '/' }: RemoveCookieProps): boolean {
  if (typeof document === 'undefined') return false;

  try {
    // To delete a cookie, you just set its expiration date to a time in the past
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    return true;
  } catch (error) {
    console.error(`Failed to remove cookie "${name}":`, error);
    return false;
  }
}