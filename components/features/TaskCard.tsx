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

import type { TaskCardProps } from '@/types';

/**
 * Enhanced TaskCard with media badges
 * Shows notes and images count for manager interface
 */
export const TaskCard = memo(function TaskCard({
  task,
  onOpenDetails,
  showMediaBadges = true,
  viewMode = 'manager',
}: TaskCardProps) {
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

  // Media counts
  const hasNotes = task.notes.length > 0;
  const hasImages = task.images.length > 0;
  const hasMedia = hasNotes || hasImages;

  return (
    <Tooltip content={roomTypeText}>
      <div
        className="p-3 rounded-lg border-2 border-divider bg-content1 cursor-pointer hover:shadow-md hover:border-default-300 transition-all"
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails?.(task)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenDetails?.(task);
          }
        }}
      >
        {/* Room Number and Priority */}
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

        {/* Due Time */}
        <div className="text-xs text-default-500 mb-2">{timeStr}</div>

        {/* Assigned Cleaners */}
        <div
          className="text-xs text-default-600 mb-2 truncate"
          title={assignedNames}
        >
          {assignedNames}
        </div>

        {/* Status Chip */}
        <div className="mb-2">
          <Chip
            color={statusStyle.color}
            size="sm"
            variant={statusStyle.variant}
          >
            {STATUS_LABELS[task.status]}
          </Chip>
        </div>

        {/* Media Badges */}
        {showMediaBadges && hasMedia && (
          <div className="flex gap-2 mt-3 pt-2 border-t border-divider">
            {hasNotes && (
              <Chip
                className="cursor-pointer"
                color="secondary"
                size="sm"
                startContent={<span className="text-sm">📝</span>}
                variant="flat"
              >
                {task.notes.length} {task.notes.length === 1 ? 'note' : 'notes'}
              </Chip>
            )}
            {hasImages && (
              <Chip
                className="cursor-pointer"
                color="primary"
                size="sm"
                startContent={<span className="text-sm">📷</span>}
                variant="flat"
              >
                {task.images.length}{' '}
                {task.images.length === 1 ? 'image' : 'images'}
              </Chip>
            )}
          </div>
        )}
      </div>
    </Tooltip>
  );
});

/**
 * Compact variant of TaskCard for timeline view
 */
export const TaskCardCompact = memo(function TaskCardCompact({
  task,
  onOpenDetails,
  showMediaBadges = true,
}: TaskCardProps) {
  const statusStyle = STATUS_STYLES[task.status];
  const hasNotes = task.notes.length > 0;
  const hasImages = task.images.length > 0;

  return (
    <div
      className="p-2 rounded-md border border-divider bg-content1 cursor-pointer hover:shadow-sm hover:border-default-300 transition-all"
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails?.(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpenDetails?.(task);
        }
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-xs text-foreground">
          Room {task.room.number}
        </span>
        {showMediaBadges && (hasNotes || hasImages) && (
          <div className="flex gap-1">
            {hasNotes && (
              <span className="text-xs" title={`${task.notes.length} notes`}>
                📝
              </span>
            )}
            {hasImages && (
              <span className="text-xs" title={`${task.images.length} images`}>
                📷
              </span>
            )}
          </div>
        )}
      </div>

      <Chip className="h-5" color={statusStyle.color} size="sm" variant="dot">
        {STATUS_LABELS[task.status]}
      </Chip>
    </div>
  );
});
