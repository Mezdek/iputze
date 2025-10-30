import { CLEANER_COLORS, DAY_NAMES, getWeekDays, isSameDay } from '@lib/shared';
import { useMemo } from 'react';

import type {
  CleanerWithTasks,
  DayData,
  StatusFilterType,
  TaskResponse,
  TimeLineViewMode,
  WeekBoundaries,
} from '@/types';

interface UseTimelineDataParams {
  currentWeekStart: Date;
  tasks: TaskResponse[] | undefined | null;
  statusFilter: StatusFilterType;
  selectedCleanerId: string | null;
}

interface UseTimelineDataReturn {
  weekBoundaries: WeekBoundaries;
  cleanersList: CleanerWithTasks[];
  weekData: DayData[];
  viewMode: TimeLineViewMode;
  totalTasks: number;
}

export function useTimelineData({
  currentWeekStart,
  tasks,
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

  // Filter tasks by week
  const weekTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueAt);
      return taskDate >= weekBoundaries.start && taskDate < weekBoundaries.end;
    });
  }, [tasks, weekBoundaries]);

  // Apply status filter
  const filteredTasks = useMemo(() => {
    if (statusFilter === 'all') return weekTasks;
    return weekTasks.filter((a) => a.status === statusFilter);
  }, [weekTasks, statusFilter]);

  // Build cleaners map
  const cleanersMap = useMemo(() => {
    const map = new Map<string, CleanerWithTasks>();

    filteredTasks.forEach((task) => {
      task.cleaners.forEach(({ id, name, email, avatarUrl }) => {
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
          cleaner.tasksThisWeek.push(task);
        }
      });
    });

    return map;
  }, [filteredTasks]);

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

    // Group tasks by date for O(1) lookup
    const tasksByDate = new Map<string, TaskResponse[]>();
    filteredTasks.forEach((task) => {
      const dateKey = new Date(task.dueAt).toDateString();
      const existing = tasksByDate.get(dateKey) ?? [];
      tasksByDate.set(dateKey, [...existing, task]);
    });

    return weekDays.map((date, index) => {
      const dateKey = date.toDateString();
      const dayTasks = tasksByDate.get(dateKey) ?? [];

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
  }, [weekDays, filteredTasks, viewMode, selectedCleanerId, cleanersMap]);

  return {
    weekBoundaries,
    cleanersList,
    weekData,
    viewMode,
    totalTasks: filteredTasks.length,
  };
}
