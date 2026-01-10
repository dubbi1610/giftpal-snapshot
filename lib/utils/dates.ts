import { format, parseISO, addDays, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

export function formatDate(dateISO: string): string {
  try {
    return format(parseISO(dateISO), 'MMM d, yyyy');
  } catch {
    return dateISO;
  }
}

export function formatDateShort(dateISO: string): string {
  try {
    return format(parseISO(dateISO), 'MMM d');
  } catch {
    return dateISO;
  }
}

export function formatDateLong(dateISO: string): string {
  try {
    return format(parseISO(dateISO), 'EEEE, MMMM d, yyyy');
  } catch {
    return dateISO;
  }
}

export function getDaysUntil(dateISO: string): number {
  try {
    const date = parseISO(dateISO);
    const today = startOfDay(new Date());
    const target = startOfDay(date);
    return differenceInDays(target, today);
  } catch {
    return 0;
  }
}

export function getRelativeDateLabel(dateISO: string): string {
  const days = getDaysUntil(dateISO);
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `In ${days} days`;
  if (days <= 30) return `In ${Math.floor(days / 7)} weeks`;
  return formatDateShort(dateISO);
}

export function isUpcoming(dateISO: string, days: number = 30): boolean {
  try {
    const date = parseISO(dateISO);
    const today = startOfDay(new Date());
    const future = addDays(today, days);
    return isAfter(date, today) && isBefore(date, future);
  } catch {
    return false;
  }
}

export function getTodayISO(): string {
  return new Date().toISOString();
}
