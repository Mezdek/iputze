import type { TaskStatus } from '@prisma/client';

import type { TaskResponse } from '@/types';

export interface CleanerWithTasks {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  color?: string;
  tasksThisWeek: TaskResponse[];
}

export interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  cleaners: CleanerWithTasks[];
  tasks: TaskResponse[];
}

export type TimeLineViewMode = 'overview' | 'selected';
export type StatusFilterType =
  | 'all'
  | TaskStatus
  | 'has-notes'
  | 'has-images'
  | 'has-media';

export interface WeekBoundaries {
  start: Date;
  end: Date;
}

export interface StatusStyle {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant: 'flat' | 'solid' | 'bordered' | 'light';
}
