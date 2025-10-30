'use client';

import {
  CleanerSelector,
  DayColumn,
  LoadingSkeleton,
  StatusFilter,
} from '@components';
import { Button, Card } from '@heroui/react';
import { useTasks, useTimelineData } from '@hooks';
import { addWeeks, formatDateRange, getWeekStart } from '@lib/shared';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import type { InjectedAuthProps, StatusFilterType } from '@/types';

export function WeeklyTimelineView(props: InjectedAuthProps) {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { data: tasks, isLoading, error } = useTasks({ hotelId });

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  );
  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  const { weekBoundaries, cleanersList, weekData, viewMode, totalTasks } =
    useTimelineData({
      currentWeekStart,
      tasks,
      statusFilter,
      selectedCleanerId,
    });

  // Week range label
  const weekRangeLabel = useMemo(() => {
    const weekEnd = new Date(weekBoundaries.end);
    weekEnd.setDate(weekEnd.getDate() - 1);
    return formatDateRange(weekBoundaries.start, weekEnd);
  }, [weekBoundaries]);

  // Navigation handlers
  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addWeeks(prev, -1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentWeekStart(getWeekStart(new Date()));
  }, []);

  const handleCleanerSelect = useCallback((cleanerId: string | null) => {
    setSelectedCleanerId(cleanerId);
  }, []);

  const handleStatusFilterChange = useCallback((status: StatusFilterType) => {
    setStatusFilter(status);
  }, []);

  const handleChipClick = useCallback((cleanerId: string) => {
    setSelectedCleanerId(cleanerId);
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
  if (error) {
    return (
      <Card className="w-full h-full p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-danger text-lg font-semibold mb-2">
              Error loading tasks
            </p>
            <p className="text-default-500 text-sm">
              {error instanceof Error
                ? error.message
                : 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            aria-label="Previous week"
            size="sm"
            variant="flat"
            onClick={handlePreviousWeek}
          >
            ←
          </Button>
          <Button
            className="min-w-[100px]"
            size="sm"
            variant="flat"
            onClick={handleToday}
          >
            Today
          </Button>
          <Button
            isIconOnly
            aria-label="Next week"
            size="sm"
            variant="flat"
            onClick={handleNextWeek}
          >
            →
          </Button>
          <span className="text-sm font-semibold text-foreground ml-2">
            {weekRangeLabel}
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          {viewMode === 'selected' && (
            <Button
              color="default"
              size="sm"
              variant="flat"
              onClick={() => handleCleanerSelect(null)}
            >
              ← Back to Overview
            </Button>
          )}
          <CleanerSelector
            cleaners={cleanersList}
            selectedCleanerId={selectedCleanerId}
            onSelect={handleCleanerSelect}
          />
        </div>
      </div>

      {/* Status Filter */}
      <StatusFilter
        currentFilter={statusFilter}
        onFilterChange={handleStatusFilterChange}
      />

      {/* Stats Summary */}
      <div className="flex items-center gap-4 text-sm text-default-600">
        <span>
          <strong className="text-foreground">{totalTasks}</strong>{' '}
          {totalTasks === 1 ? 'task' : 'tasks'} this week
        </span>
        {viewMode === 'overview' && (
          <span>
            <strong className="text-foreground">{cleanersList.length}</strong>{' '}
            {cleanersList.length === 1 ? 'cleaner' : 'cleaners'}
          </span>
        )}
      </div>

      {/* Week Grid */}
      <Card className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-7 gap-2 h-full min-h-[500px]">
          {weekData.map((day) => (
            <DayColumn
              day={day}
              key={day.date.toISOString()}
              user={props.user}
              viewMode={viewMode}
              onChipClick={handleChipClick}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
