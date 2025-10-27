'use client';
import { Chip } from '@heroui/react';
import { memo } from 'react';

import type { CleanerWithTasks } from '@/types';

interface CleanerChipProps {
  cleaner: CleanerWithTasks;
  taskCount: number;
  onClick: () => void;
}

export const CleanerChip = memo(function CleanerChip({
  cleaner,
  taskCount,
  onClick,
}: CleanerChipProps) {
  return (
    <button
      className="w-full flex items-center gap-2 p-2 rounded-lg bg-content1 border border-divider hover:border-default-300 hover:shadow-sm transition-all cursor-pointer"
      title={`Click to view ${cleaner.name}'s schedule`}
      type="button"
      onClick={onClick}
    >
      <div
        aria-label={cleaner.name}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: cleaner.color }}
      >
        {cleaner.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium truncate text-foreground">
          {cleaner.name}
        </div>
      </div>
      <Chip color="default" size="sm" variant="flat">
        {taskCount}
      </Chip>
    </button>
  );
});
