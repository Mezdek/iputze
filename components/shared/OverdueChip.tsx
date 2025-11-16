'use client';
import { Chip, Tooltip } from '@heroui/react';

export function OverdueChip({ isOverdue }: { isOverdue: boolean }) {
  if (!isOverdue) return null;
  return (
    <Tooltip content="Overdue">
      <Chip color="danger" size="sm" variant="flat">
        !
      </Chip>
    </Tooltip>
  );
}
