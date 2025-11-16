// @TODO Assign Task should create a task
'use client';
import { memo } from 'react';

import { TaskCreation } from '@/components/shared';

interface EmptyDayStateProps {
  hotelId: string;
  isTaskCreationButtonDisabled?: boolean;
  defaultDate?: Date;
}

export const EmptyDayState = memo(function EmptyDayState({
  hotelId,
  isTaskCreationButtonDisabled,
  defaultDate,
}: EmptyDayStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-default-400">
      <p className="text-xs mb-2">No tasks scheduled</p>
      <TaskCreation
        defaultDate={defaultDate}
        hotelId={hotelId}
        isDisabled={isTaskCreationButtonDisabled}
      />
    </div>
  );
});
