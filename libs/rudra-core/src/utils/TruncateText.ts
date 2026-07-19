export interface TruncateTextProps {
  /** The text to truncate */
  text: any;
  /** Maximum number of characters before cutting (default: 100) */
  length?: number;
  /** What to append at the end of cut text (default: '...') */
  suffix?: string;
  /** Fallback if the text is invalid */
  fallback?: string;
}

export default function TruncateText({
  text,
  length = 100,
  suffix = '...',
  fallback = ''
}: TruncateTextProps): string {
  if (text === null || text === undefined || text === '') return fallback;

  try {
    // Safely convert numbers or booleans to string
    const stringText = String(text);
    
    if (stringText.length <= length) return stringText;

    // Cut the string and add the suffix. 
    // `.trim()` ensures we don't end up with spaces before the '...' like "Hello ..."
    return stringText.slice(0, length).trim() + suffix;
  } catch (error) {
    console.error('Failed to truncate text:', error);
    return fallback;
  }
}