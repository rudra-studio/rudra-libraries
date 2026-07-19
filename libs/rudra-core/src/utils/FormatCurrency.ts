export interface FormatCurrencyProps {
  /** The amount to format (number or string) */
  amount: any;
  /** The 3-letter currency code (default: 'USD') */
  currency?: string;
  /** The locale code for formatting rules (default: 'en-US') */
  locale?: string;
  /** Number of decimal places to show (default: 2) */
  decimals?: number;
  /** Fallback if the amount is invalid */
  fallback?: string;
}

export default function FormatCurrency({
  amount,
  currency = 'USD',
  locale = 'en-US',
  decimals = 2,
  fallback = ''
}: FormatCurrencyProps): string {
  if (amount === null || amount === undefined || amount === '') return fallback;

  try {
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(parsedAmount)) return fallback;

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(parsedAmount);
  } catch (error) {
    console.error('Failed to format currency:', error);
    return fallback;
  }
}