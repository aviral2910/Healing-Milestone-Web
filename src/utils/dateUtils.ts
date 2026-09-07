export function safeUtcDate(dateInput: string | number | Date | null | undefined): Date {
  if (!dateInput) return new Date(0);
  if (typeof dateInput === 'string') {
    // If it's a date-time string without a timezone specifier, append Z to force UTC
    if (dateInput.includes('T') && !dateInput.endsWith('Z') && !dateInput.match(/[+-]\d{2}:\d{2}$/)) {
      return new Date(dateInput + 'Z');
    }
  }
  return new Date(dateInput);
}
