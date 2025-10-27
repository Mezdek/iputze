'use client';
import { Button } from '@heroui/react';
import { STATUS_LABELS } from '@lib/shared';
import { AssignmentStatus } from '@prisma/client';
import { memo } from 'react';

import type { StatusFilterType } from '@/types';

interface StatusFilterProps {
  currentFilter: StatusFilterType;
  onFilterChange: (status: StatusFilterType) => void;
}

export const StatusFilter = memo(function StatusFilter({
  currentFilter,
  onFilterChange,
}: StatusFilterProps) {
  const filterOptions: Array<{ value: StatusFilterType; label: string }> = [
    { value: 'all', label: 'All' },
    {
      value: AssignmentStatus.PENDING,
      label: STATUS_LABELS[AssignmentStatus.PENDING],
    },
    {
      value: AssignmentStatus.IN_PROGRESS,
      label: STATUS_LABELS[AssignmentStatus.IN_PROGRESS],
    },
    {
      value: AssignmentStatus.COMPLETED,
      label: STATUS_LABELS[AssignmentStatus.COMPLETED],
    },
    {
      value: AssignmentStatus.CANCELLED,
      label: STATUS_LABELS[AssignmentStatus.CANCELLED],
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-content1 rounded-lg p-2 shadow-sm overflow-x-auto">
      <span className="text-sm font-medium whitespace-nowrap text-foreground">
        Filter:
      </span>
      <div className="flex gap-1">
        {filterOptions.map(({ value, label }) => (
          <Button
            color={currentFilter === value ? 'primary' : 'default'}
            key={value}
            size="sm"
            variant={currentFilter === value ? 'solid' : 'flat'}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
});
