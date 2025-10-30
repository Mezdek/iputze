'use client';
import { Button, ButtonGroup } from '@heroui/react';
import { TaskStatus } from '@prisma/client';

import type { StatusFilterType } from '@/types';

export function StatusFilter({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: StatusFilterType;
  onFilterChange: (status: StatusFilterType) => void;
}) {
  const filters: Array<{
    key: StatusFilterType;
    label: string;
    color: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }> = [
    { key: 'all', label: 'All', color: 'default' },
    { key: TaskStatus.PENDING, label: 'Pending', color: 'warning' },
    {
      key: TaskStatus.IN_PROGRESS,
      label: 'In Progress',
      color: 'primary',
    },
    { key: TaskStatus.COMPLETED, label: 'Completed', color: 'success' },
    { key: TaskStatus.CANCELLED, label: 'Cancelled', color: 'danger' },
  ];

  return (
    <ButtonGroup size="sm">
      {filters.map((filter) => (
        <Button
          color={currentFilter === filter.key ? filter.color : 'default'}
          key={filter.key}
          variant={currentFilter === filter.key ? 'solid' : 'flat'}
          onPress={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
