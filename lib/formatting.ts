/**
 * Format a number as kilograms with one decimal place
 * Example: formatKg(1.234) => "1,2 kg"
 */
export function formatKg(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0 kg';
  }
  return new Intl.NumberFormat('it-IT', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value) + ' kg';
}

/**
 * Format a number as currency (EUR) with two decimal places
 * Example: formatCurrency(10.5) => "€ 10,50"
 */
export function formatCurrency(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '€ 0,00';
  }
  const formatted = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  // Replace 'EUR' with '€' if present
  return formatted.replace('EUR', '€').trim();
}

/**
 * Format a count with locale-specific number formatting
 * Example: formatCount(1000) => "1.000"
 */
export function formatCount(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('it-IT').format(value);
}

/**
 * Format a date string in Italian format
 * Example: formatDate('2026-05-11') => "11 maggio 2026"
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) {
    return 'Non disponibile';
  }
  try {
    const date = new Date(dateString + 'T00:00:00Z');
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}
