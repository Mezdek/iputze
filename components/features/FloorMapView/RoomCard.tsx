'use client';

import { Card, CardBody, Chip, cn } from '@heroui/react';
import { getStatusColorClass } from '@lib/client';
import { memo } from 'react';

import type { RoomWithStatus } from '@/types';

interface RoomCardProps {
  room: RoomWithStatus;
  isSelected: boolean;
  onClick: () => void;
}

export const RoomCard = memo(function RoomCard({
  room,
  isSelected,
  onClick,
}: RoomCardProps) {
  const statusColorClass = getStatusColorClass(room.status.status);

  // Check if room has high-priority tasks
  const hasHighPriority = room.tasks?.some((task) => task.priority >= 1);

  return (
    <Card
      isHoverable
      isPressable
      className={cn(
        'transition-all duration-200 cursor-pointer border-2',
        statusColorClass,
        isSelected && 'ring-2 ring-primary shadow-lg scale-105 z-10'
      )}
      onClick={onClick}
    >
      <CardBody className="p-3 space-y-2">
        {/* Room number and status */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg text-foreground">
              {room.number}
            </span>
            {hasHighPriority && (
              <span
                className="text-warning text-xs"
                title="High priority tasks"
              >
                ⚠️
              </span>
            )}
          </div>
          <Chip color={room.status.color} size="sm" variant="flat">
            {room.status.label}
          </Chip>
        </div>

        {/* Room details */}
        {room.type && (
          <div className="text-xs truncate" title={room.type}>
            {room.type}
          </div>
        )}

        {/* Floor indicator if present */}
        {room.floor !== undefined && room.floor !== null && (
          <div className="text-xs">Floor {room.floor}</div>
        )}
        {/* Task count badge */}
        {room.taskCount > 0 && (
          <p className="text-xs px-2 py-1 bg-default-100 rounded-full w-fit">
            {room.taskCount} {room.taskCount === 1 ? 'task' : 'tasks'}
          </p>
        )}
      </CardBody>
    </Card>
  );
});
