/**
 * Format a number as currency using its ISO 4217 code.
 * Falls back to a sensible default locale per currency.
 */
export function formatCurrency(amount: number | string, currency = 'INR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '—';

  const localeMap: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'en-IE',
    GBP: 'en-GB',
    AUD: 'en-AU',
    CAD: 'en-CA',
    AED: 'en-AE',
    SGD: 'en-SG',
    JPY: 'ja-JP',
    CHF: 'de-CH',
    CNY: 'zh-CN',
    HKD: 'en-HK',
    NZD: 'en-NZ',
    ZAR: 'en-ZA',
    SEK: 'sv-SE',
  };

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type ClassValue = string | number | null | false | undefined;
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
