'use client';
import { Button } from '@heroui/react';
import { memo } from 'react';

interface EmptyDayStateProps {
  mode: 'overview' | 'selected';
}

export const EmptyDayState = memo(function EmptyDayState({
  mode,
}: EmptyDayStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-default-400">
      <p className="text-xs mb-2">
        {mode === 'overview' ? 'No tasks scheduled' : 'No tasks'}
      </p>
      <Button color="primary" size="sm" variant="flat">
        + Assign Task
      </Button>
    </div>
  );
});
