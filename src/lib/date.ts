/**
 * Parse DD.MM.YYYY date string to Date object.
 * Frontmatter dates use this format (e.g., "20.01.2025").
 */
export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('.');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Format a Date object for display (en-US locale, short month).
 * Output: "Jan 20, 2025"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
