export interface FormatDateProps {
  /** The date value to format (ISO string, timestamp, or Date object) */
  date: any;
  /** How long the date should be (e.g., 'short' = 7/19/26, 'long' = July 19, 2026) */
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  /** How long the time should be (leave undefined to hide time) */
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  /** The locale code (default: 'en-US') */
  locale?: string;
  /** Fallback if the date is invalid or empty */
  fallback?: string;
}

export default function FormatDate({
  date = Date.now(),
  dateStyle = 'medium',
  timeStyle,
  locale = 'en-US',
  fallback = ''
}: FormatDateProps): string {
  if (!date) return fallback;

  try {
    const parsedDate = new Date(date);
    
    // Check if it's a valid date
    if (isNaN(parsedDate.getTime())) return fallback;

    return new Intl.DateTimeFormat(locale, {
      dateStyle,
      timeStyle
    }).format(parsedDate);
  } catch (error) {
    console.error('Failed to format date:', error);
    return fallback;
  }
}