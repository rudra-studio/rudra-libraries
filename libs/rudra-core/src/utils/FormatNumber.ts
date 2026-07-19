export interface FormatNumberProps {
  /** The number to format */
  value: any;
  /** The locale code (default: 'en-US') */
  locale?: string;
  /** If true, formats as 1.5K, 2M, etc. */
  compact?: boolean;
  /** Number of decimal places to show */
  decimals?: number;
  /** Fallback if the value is invalid */
  fallback?: string;
}

export default function FormatNumber({
  value,
  locale = 'en-US',
  compact = false,
  decimals = 0,
  fallback = ''
}: FormatNumberProps): string {
  if (value === null || value === undefined || value === '') return fallback;

  try {
    const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(parsedValue)) return fallback;

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };

    if (compact) {
      options.notation = 'compact';
      options.compactDisplay = 'short';
    }

    return new Intl.NumberFormat(locale, options).format(parsedValue);
  } catch (error) {
    console.error('Failed to format number:', error);
    return fallback;
  }
}