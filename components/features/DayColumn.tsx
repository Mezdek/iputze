import { CleanerChip, EmptyDayState, TaskCard } from '@components';
import { memo } from 'react';

import type { DayData, TimeLineViewMode } from '@/types';

interface DayColumnProps {
  day: DayData;
  viewMode: TimeLineViewMode;
  onChipClick: (cleanerId: string) => void;
}

export const DayColumn = memo(function DayColumn({
  day,
  viewMode,
  onChipClick,
}: DayColumnProps) {
  const totalTasks = day.tasks.length;
  const uniqueCleaners = day.cleaners.length;

  return (
    <div
      className={`flex flex-col border border-divider rounded-lg overflow-hidden ${
        day.isWeekend ? 'bg-default-50' : 'bg-content1'
      }`}
    >
      {/* Day Header */}
      <div
        className={`p-2 text-center border-b border-divider ${
          day.isToday
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'bg-default-100 text-default-700'
        }`}
      >
        <div className="text-xs">{day.dayName}</div>
        <div className="text-lg font-bold">{day.dayNumber}</div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {viewMode === 'overview' ? (
          day.cleaners.length > 0 ? (
            day.cleaners.map((cleaner) => {
              const cleanerTasksToday = day.tasks.filter((task) =>
                task.cleaners.some(({ id }) => id === cleaner.id)
              );
              return (
                <CleanerChip
                  cleaner={cleaner}
                  key={cleaner.id}
                  taskCount={cleanerTasksToday.length}
                  onClick={() => onChipClick(cleaner.id)}
                />
              );
            })
          ) : (
            <EmptyDayState mode="overview" />
          )
        ) : day.tasks.length > 0 ? (
          day.tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <EmptyDayState mode="selected" />
        )}
      </div>

      {/* Footer Stats */}
      {viewMode === 'overview' && totalTasks > 0 && (
        <div className="p-2 text-xs text-center border-t border-divider bg-default-50 text-default-600">
          <div>{totalTasks} tasks</div>
          <div>{uniqueCleaners} cleaners</div>
        </div>
      )}
    </div>
  );
});
