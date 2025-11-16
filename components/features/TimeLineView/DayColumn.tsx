import { CleanerChip, EmptyDayState, TaskItem } from '@components';
import { cn } from '@heroui/react';
import { memo } from 'react';

import type { CleanerWithTasks, DayData, MeResponse } from '@/types';

type TSelection = { cleanerId: string | null; dayNumber: number | null };

interface DayColumnProps {
  day: DayData;
  hotelId: string;
  onChipClick: (selection: TSelection) => void;
  selection: TSelection;
  user: MeResponse;
}

export const DayColumn = memo(function DayColumn({
  day,
  hotelId,
  onChipClick,
  selection,
  user,
}: DayColumnProps) {
  const totalTasks = day.selectedTasks.length;
  const uniqueCleaners = day.cleaners.length;

  return (
    <div
      className={cn(
        'flex flex-col border border-divider rounded-lg overflow-hidden w-full',
        day.isWeekend ? 'bg-default-50' : 'bg-content1',
        day.dayNumber === selection.dayNumber ? 'col-span-2' : ''
      )}
    >
      {/* Day Header */}
      <div
        className={`p-2 text-center border-b border-divider w-full ${
          day.isToday
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'bg-default-100 text-default-700'
        }`}
        role="button"
        tabIndex={0}
        onClick={() => onChipClick({ cleanerId: null, dayNumber: null })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onChipClick({ cleanerId: null, dayNumber: null });
          }
        }}
      >
        <div className="text-xs">{day.dayName}</div>
        <div className="text-lg font-bold">{day.dayNumber}</div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        <Day
          day={day}
          hotelId={hotelId}
          selection={selection}
          user={user}
          onChipClick={onChipClick}
        />
      </div>

      <div className="p-2 text-xs text-center border-t border-divider bg-default-50 text-default-600">
        <div>{totalTasks} tasks</div>
        <div>{uniqueCleaners} cleaners</div>
      </div>
    </div>
  );
});

function Day({
  day,
  hotelId,
  onChipClick,
  selection,
  user,
}: {
  day: DayData;
  hotelId: string;
  onChipClick: (props: TSelection) => void;
  selection: TSelection;
  user: MeResponse;
}) {
  if (selection.dayNumber === day.dayNumber) {
    const restCleaners = day.cleaners.filter(
      ({ id }) => id !== selection.cleanerId
    );
    return (
      <>
        {day.selectedTasks.map((task) => (
          <TaskItem key={task.id} task={task} user={user} />
        ))}
        <CleanerChipList
          cleaners={restCleaners}
          day={day}
          onChipClick={onChipClick}
        />
      </>
    );
  }
  if (day.cleaners.length < 1) {
    return (
      <EmptyDayState
        defaultDate={day.date}
        hotelId={hotelId}
        isTaskCreationButtonDisabled={day.isPast}
      />
    );
  }
  return (
    <CleanerChipList
      cleaners={day.cleaners}
      day={day}
      onChipClick={onChipClick}
    />
  );
}

function CleanerChipList({
  cleaners,
  onChipClick,
  day,
}: {
  cleaners: CleanerWithTasks[];
  onChipClick: (props: TSelection) => void;
  day: DayData;
}) {
  return cleaners.map((cleaner) => {
    const cleanerTasksToday = day.dayTasks.filter((task) =>
      task.cleaners.some(({ id }) => id === cleaner.id)
    );
    return (
      <CleanerChip
        cleaner={cleaner}
        key={cleaner.id}
        taskCount={cleanerTasksToday.length}
        onClick={() =>
          onChipClick({
            cleanerId: cleaner.id,
            dayNumber: day.dayNumber,
          })
        }
      />
    );
  });
}
