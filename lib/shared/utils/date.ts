import { formatInTimeZone } from 'date-fns-tz';
import type { Locale } from 'next-intl';

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    return day;
  });
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
  const endStr = end.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${startStr} - ${endStr}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function formatTimeInTimezone(
  date: Date | string | null,
  timezone: string = 'UTC'
): string {
  if (!date) return '--:--';
  return formatInTimeZone(new Date(date), timezone, 'HH:mm');
}

export function getDateInTimezone(
  date: Date | string,
  timezone: string = 'UTC'
): Date {
  const zonedTime = formatInTimeZone(
    new Date(date),
    timezone,
    'yyyy-MM-dd HH:mm:ss'
  );
  return new Date(zonedTime);
}

export function datefy(
  datestring: string | Date | null | undefined,
  locale: Locale = 'en',
  emptyResponse: string = 'N/A'
) {
  if (datestring === undefined || datestring === null) {
    return emptyResponse;
  }
  try {
    return new Date(datestring).toLocaleDateString(locale);
  } catch (error) {
    console.error(error);
    return 'Date could not be parsed';
  }
}

export function tomorrowAt(time: string): Date {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // matches HH:MM in 24-hour format

  if (typeof time !== 'string') {
    throw new Error('Time must be a string');
  }

  if (!timePattern.test(time)) {
    throw new Error('Invalid time format. Expected HH:MM in 24-hour format.');
  }

  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(hour, minute, 0, 0);

  return tomorrow;
}
