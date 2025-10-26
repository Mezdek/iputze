import { formatInTimeZone } from 'date-fns-tz';

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
