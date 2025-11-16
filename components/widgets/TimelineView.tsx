'use client';

import {
  CleanerSelector,
  DayColumn,
  LoadingSkeleton,
  StatusFilter,
} from '@components';
import { Button, Card, cn } from '@heroui/react';
import { useTasks, useTimelineData } from '@hooks';
import { addWeeks } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import type { HotelViewProps } from '@/app/hotels/[hotelId]/page';
import { formatDateRange, getWeekStart } from '@/lib/shared/utils/date';
import type { StatusFilterType } from '@/types';

type TSelection = { cleanerId: string | null; dayNumber: number | null };
const defaultSelection = {
  cleanerId: null,
  dayNumber: null,
};
export function WeeklyTimelineView({ hotelId, user }: HotelViewProps) {
  const { data: tasks, isLoading, error } = useTasks({ hotelId });

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  );

  const [selection, setSelection] = useState<TSelection>(defaultSelection);

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  const { weekBoundaries, cleanersList, weekData, totalTasks } =
    useTimelineData({
      currentWeekStart,
      tasks,
      statusFilter,
      selectedCleanerId: selection.cleanerId,
    });

  // Week range label
  const weekRangeLabel = useMemo(() => {
    const weekEnd = new Date(weekBoundaries.end);
    weekEnd.setDate(weekEnd.getDate() - 1);
    return formatDateRange(weekBoundaries.start, weekEnd);
  }, [weekBoundaries]);

  // Navigation handlers
  const handlePreviousWeek = useCallback(() => {
    setSelection(defaultSelection);
    setCurrentWeekStart((prev) => addWeeks(prev, -1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setSelection(defaultSelection);
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setSelection(defaultSelection);
    setCurrentWeekStart(getWeekStart(new Date()));
  }, []);

  const handleStatusFilterChange = useCallback((status: StatusFilterType) => {
    setStatusFilter(status);
  }, []);

  const handleChipClick = useCallback((select: TSelection) => {
    setSelection(select);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full h-full p-4">
        <LoadingSkeleton />
      </Card>
    );
  }

  // Error state
  if (error) return <ErrorComp error={error} />;

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Week Navigation */}
        <WeekNavigation
          handleNextWeek={handleNextWeek}
          handlePreviousWeek={handlePreviousWeek}
          handleToday={handleToday}
          weekRangeLabel={weekRangeLabel}
        />

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <CleanerSelector
            cleaners={cleanersList}
            selectedCleanerId={selection.cleanerId}
            onSelect={(id: string | null) =>
              handleChipClick({ ...selection, cleanerId: id })
            }
          />
        </div>
      </div>

      {/* Status Filter */}
      <StatusFilter
        currentFilter={statusFilter}
        onFilterChange={handleStatusFilterChange}
      />

      {/* Stats Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span>
          <strong className="text-foreground">{totalTasks}</strong>{' '}
          {totalTasks === 1 ? 'task' : 'tasks'} this week
        </span>
      </div>

      {/* Week Grid */}
      <Card className="flex-1 p-4 overflow-auto">
        <div
          className={cn(
            'flex flex-col md:grid md:grid-cols-7 gap-2 h-full min-h-[500px]',
            !selection.dayNumber ? 'md:grid-cols-7' : 'md:grid-cols-8'
          )}
        >
          {weekData.map((day) => (
            <DayColumn
              day={day}
              hotelId={hotelId}
              key={day.date.toISOString()}
              selection={selection}
              user={user}
              onChipClick={handleChipClick}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function WeekNavigation({
  handleNextWeek,
  handlePreviousWeek,
  handleToday,
  weekRangeLabel,
}: {
  weekRangeLabel: string;
  handlePreviousWeek: () => void;
  handleNextWeek: () => void;
  handleToday: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        isIconOnly
        aria-label="Previous week"
        size="sm"
        variant="flat"
        onPress={handlePreviousWeek}
      >
        ←
      </Button>
      <Button
        className="min-w-[100px]"
        size="sm"
        variant="flat"
        onPress={handleToday}
      >
        Today
      </Button>
      <Button
        isIconOnly
        aria-label="Next week"
        size="sm"
        variant="flat"
        onPress={handleNextWeek}
      >
        →
      </Button>
      <span className="text-sm font-semibold text-foreground ml-2">
        {weekRangeLabel}
      </span>
    </div>
  );
}

function ErrorComp({ error }: { error: unknown }) {
  return (
    <Card className="w-full h-full p-4">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-danger text-lg font-semibold mb-2">
            Error loading tasks
          </p>
          <p className="text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    </Card>
  );
}
