import { CLEANER_COLORS, DAY_NAMES, getWeekDays, isSameDay } from '@lib/shared';
import { useMemo } from 'react';

import type {
  CleanerWithTasks,
  DayData,
  StatusFilterType,
  TAssignmentResponse,
  TimeLineViewMode,
  WeekBoundaries,
} from '@/types';

interface UseTimelineDataParams {
  currentWeekStart: Date;
  assignments: TAssignmentResponse[] | undefined | null;
  statusFilter: StatusFilterType;
  selectedCleanerId: string | null;
}

interface UseTimelineDataReturn {
  weekBoundaries: WeekBoundaries;
  cleanersList: CleanerWithTasks[];
  weekData: DayData[];
  viewMode: TimeLineViewMode;
  totalAssignments: number;
}

export function useTimelineData({
  currentWeekStart,
  assignments,
  statusFilter,
  selectedCleanerId,
}: UseTimelineDataParams): UseTimelineDataReturn {
  const viewMode: TimeLineViewMode = selectedCleanerId
    ? 'selected'
    : 'overview';

  // Calculate week boundaries
  const weekBoundaries = useMemo((): WeekBoundaries => {
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }, [currentWeekStart]);

  // Filter assignments by week
  const weekAssignments = useMemo(() => {
    if (!assignments) return [];

    return assignments.filter((assignment) => {
      const assignmentDate = new Date(assignment.dueAt);
      return (
        assignmentDate >= weekBoundaries.start &&
        assignmentDate < weekBoundaries.end
      );
    });
  }, [assignments, weekBoundaries]);

  // Apply status filter
  const filteredAssignments = useMemo(() => {
    if (statusFilter === 'all') return weekAssignments;
    return weekAssignments.filter((a) => a.status === statusFilter);
  }, [weekAssignments, statusFilter]);

  // Build cleaners map
  const cleanersMap = useMemo(() => {
    const map = new Map<string, CleanerWithTasks>();

    filteredAssignments.forEach((assignment) => {
      assignment.cleaners.forEach(({ id, name, email, avatarUrl }) => {
        if (!map.has(id)) {
          map.set(id, {
            id,
            name,
            email,
            avatarUrl,
            color: CLEANER_COLORS[map.size % CLEANER_COLORS.length],
            tasksThisWeek: [],
          });
        }
        const cleaner = map.get(id);
        if (cleaner) {
          cleaner.tasksThisWeek.push(assignment);
        }
      });
    });

    return map;
  }, [filteredAssignments]);

  // Get sorted cleaners list
  const cleanersList = useMemo(() => {
    return Array.from(cleanersMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [cleanersMap]);

  // Get week days
  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  // Build day data
  const weekData = useMemo((): DayData[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group assignments by date for O(1) lookup
    const assignmentsByDate = new Map<string, TAssignmentResponse[]>();
    filteredAssignments.forEach((assignment) => {
      const dateKey = new Date(assignment.dueAt).toDateString();
      const existing = assignmentsByDate.get(dateKey) ?? [];
      assignmentsByDate.set(dateKey, [...existing, assignment]);
    });

    return weekDays.map((date, index) => {
      const dateKey = date.toDateString();
      const dayTasks = assignmentsByDate.get(dateKey) ?? [];

      // Filter by selected cleaner if in selected mode
      const visibleTasks =
        viewMode === 'selected' && selectedCleanerId
          ? dayTasks.filter((task) =>
              task.cleaners.some((c) => c.id === selectedCleanerId)
            )
          : dayTasks;

      // Get unique cleaners for this day
      const cleanerIds = new Set<string>();
      visibleTasks.forEach((task) => {
        task.cleaners.forEach((cleaner) => cleanerIds.add(cleaner.id));
      });

      const dayCleaners = Array.from(cleanerIds)
        .map((id) => cleanersMap.get(id))
        .filter(
          (cleaner): cleaner is CleanerWithTasks => cleaner !== undefined
        );

      // Ensure dayName is always defined (defensive approach)
      const dayName = DAY_NAMES[index];
      if (!dayName) {
        throw new Error(`Invalid day index: ${index}`);
      }

      return {
        date,
        dayName,
        dayNumber: date.getDate(),
        isToday: isSameDay(date, today),
        isWeekend: index >= 5,
        cleaners: dayCleaners,
        tasks: visibleTasks,
      };
    });
  }, [weekDays, filteredAssignments, viewMode, selectedCleanerId, cleanersMap]);

  return {
    weekBoundaries,
    cleanersList,
    weekData,
    viewMode,
    totalAssignments: filteredAssignments.length,
  };
}
