export interface FormatStringCaseProps {
  /** The text to transform */
  text: any;
  /** The type of transformation to apply */
  type: 'uppercase' | 'lowercase' | 'capitalize' | 'capitalizeWords';
  /** Fallback if text is invalid */
  fallback?: string;
}

export default function FormatStringCase({
  text,
  type,
  fallback = ''
}: FormatStringCaseProps): string {
  if (text === null || text === undefined || text === '') return fallback;

  try {
    const stringText = String(text);

    switch (type) {
      case 'uppercase':
        return stringText.toUpperCase();
      case 'lowercase':
        return stringText.toLowerCase();
      case 'capitalize': // "hello world" -> "Hello world"
        return stringText.charAt(0).toUpperCase() + stringText.slice(1).toLowerCase();
      case 'capitalizeWords': // "hello world" -> "Hello World"
        return stringText
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
      default:
        return stringText;
    }
  } catch (error) {
    console.error('Failed to format string case:', error);
    return fallback;
  }
}