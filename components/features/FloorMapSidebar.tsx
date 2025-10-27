'use client';

import { Room, RoomDetails } from '@components';
import { Button, Card, cn } from '@heroui/react';
import { memo } from 'react';

import type { RoomWithHotel, TAssignmentResponse } from '@/types';

interface FloorMapSidebarProps {
  room: RoomWithHotel | undefined;
  tasks: TAssignmentResponse[];
  hotelId: string;
  onClose?: () => void;
  className?: string;
}

export const FloorMapSidebar = memo(function FloorMapSidebar({
  room,
  tasks,
  hotelId,
  onClose,
  className,
}: FloorMapSidebarProps) {
  // Room selected - show room details
  if (room) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {/* Close button for mobile */}
        {onClose && (
          <Button
            className="lg:hidden"
            size="sm"
            variant="flat"
            onClick={onClose}
          >
            ← Back to Map
          </Button>
        )}
        <RoomDetails
          className="flex-1"
          defaultCleaners={[]}
          room={room}
          tasks={tasks}
        />
      </div>
    );
  }

  // No room selected - show creation and management
  return (
    <Card className={cn('flex flex-col h-full gap-4 p-4', className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Room Management
        </h3>
        <p className="text-sm text-default-500">
          Select a room to view details or create a new room
        </p>
      </div>

      <div className="space-y-4">
        <Room.RoomCreation hotelId={hotelId} />
        {tasks && tasks.length > 0 && <Room.TaskManagement tasks={tasks} />}
      </div>
    </Card>
  );
});
