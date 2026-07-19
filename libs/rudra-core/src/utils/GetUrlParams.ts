export interface GetUrlParamProps {
  /** The name of the parameter to extract (e.g., 'id' or 'category') */
  paramName: string;
  /** What to return if the parameter isn't found */
  fallback?: any;
}

export default function GetUrlParam({
  paramName,
  fallback = null
}: GetUrlParamProps): any {
  // SSR Safety: The server doesn't have access to the browser's window object
  if (typeof window === 'undefined') return fallback;

  try {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(paramName);

    return value !== null ? value : fallback;
  } catch (error) {
    console.error(`Failed to get URL param "${paramName}":`, error);
    return fallback;
  }
}