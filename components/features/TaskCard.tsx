'use client';
import { Chip, Tooltip } from '@heroui/react';
import {
  formatTimeInTimezone,
  PRIORITY_INDICATORS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from '@lib/shared';
import { memo } from 'react';

import type { TAssignmentResponse } from '@/types';

interface TaskCardProps {
  task: TAssignmentResponse;
}

export const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
  const statusStyle = STATUS_STYLES[task.status];
  const priorityColor =
    PRIORITY_INDICATORS[task.priority as keyof typeof PRIORITY_INDICATORS];
  const timeStr = formatTimeInTimezone(task.dueAt);

  const assignedNames = task.cleaners.map(({ name }) => name).join(', ');

  const roomTypeText = task.room.type
    ? `${task.room.type}${task.room.floor ? `, Floor ${task.room.floor}` : ''}`
    : task.room.floor
      ? `Floor ${task.room.floor}`
      : 'No details';

  return (
    <Tooltip content={roomTypeText}>
      <div className="p-3 rounded-lg border-2 border-divider bg-content1 cursor-pointer hover:shadow-md hover:border-default-300 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {priorityColor && (
              <div
                aria-label={
                  PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]
                }
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: priorityColor }}
                title={
                  PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]
                }
              />
            )}
            <span className="font-bold text-sm text-foreground">
              Room {task.room.number}
            </span>
          </div>
        </div>

        <div className="text-xs text-default-500 mb-2">{timeStr}</div>

        <div
          className="text-xs text-default-600 mb-2 truncate"
          title={assignedNames}
        >
          {assignedNames}
        </div>

        <Chip color={statusStyle.color} size="sm" variant={statusStyle.variant}>
          {STATUS_LABELS[task.status]}
        </Chip>
      </div>
    </Tooltip>
  );
});
