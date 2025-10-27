import type { AssignmentStatus } from '@prisma/client';

import type { TAssignmentResponse } from '@/types';

export interface CleanerWithTasks {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  color?: string;
  tasksThisWeek: TAssignmentResponse[];
}

export interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  cleaners: CleanerWithTasks[];
  tasks: TAssignmentResponse[];
}

export type ViewMode = 'overview' | 'selected';
export type StatusFilterType = 'all' | AssignmentStatus;

export interface WeekBoundaries {
  start: Date;
  end: Date;
}

export interface StatusStyle {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant: 'flat' | 'solid' | 'bordered' | 'light';
}
