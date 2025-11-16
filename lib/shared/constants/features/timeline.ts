import { TaskStatus } from '@prisma/client';

import type { StatusStyle } from '@/types';

// Using HeroUI semantic colors for task statuses
export const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  [TaskStatus.PENDING]: {
    color: 'default',
    variant: 'flat',
  },
  [TaskStatus.IN_PROGRESS]: {
    color: 'warning',
    variant: 'flat',
  },
  [TaskStatus.COMPLETED]: {
    color: 'success',
    variant: 'flat',
  },
  [TaskStatus.CANCELED]: {
    color: 'danger',
    variant: 'flat',
  },
} as const;

// Custom colors for cleaner avatars (not semantic, for visual distinction)
export const CLEANER_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#14b8a6', // teal-500
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
] as const;

// Priority indicators (kept as custom colors for semantic meaning)
export const PRIORITY_INDICATORS = {
  0: null,
  1: '#f59e0b', // amber-500 for high priority
  2: '#ef4444', // red-500 for urgent
} as const;

export const DAY_NAMES = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'Pending',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.CANCELED]: 'Canceled',
} as const;

export const PRIORITY_LABELS = {
  0: 'Normal',
  1: 'High',
  2: 'Urgent',
} as const;
