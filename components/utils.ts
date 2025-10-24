import { AssignmentStatus } from '@prisma/client';

export const NEXT_STATUS = {
  [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
  [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.COMPLETED,
} as const;

export const STATUS_STRING = {
  [AssignmentStatus.IN_PROGRESS]: { button: 'finish', state: 'in_progress' },
  [AssignmentStatus.PENDING]: { button: 'start', state: 'pending' },
  [AssignmentStatus.CANCELLED]: { button: 'restart', state: 'canceled' },
  [AssignmentStatus.COMPLETED]: { button: '', state: 'completed' },
} as const;

type Props = {
  dateTime: string | number | Date;
  locale?: Intl.Locale;
  options?: Intl.DateTimeFormatOptions;
};

export function dateAndTime({ dateTime, locale, options }: Props) {
  const parsedOtions: Intl.DateTimeFormatOptions = {
    hour12: false,
    minute: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
    day: 'numeric',
    weekday: 'long',
    month: 'short',
    ...options,
  };
  return new Date(dateTime).toLocaleDateString(locale ?? 'de-DE', parsedOtions);
}
