'use client';

import { HotelManagement, RoomDetails } from '@components';
import { cn } from '@heroui/react';
import { memo } from 'react';

import type { RoomWithContext, TaskResponse } from '@/types';

interface FloorMapSidebarProps {
  room?: RoomWithContext;
  tasks?: TaskResponse[] | null;
  className?: string;
  hotelId: string;
}

export const FloorMapSideBar = memo(function FloorMapSideBar({
  room,
  tasks,
  className,
  hotelId,
}: FloorMapSidebarProps) {
  // Room selected - show room details
  if (room) {
    const roomTasks = tasks?.filter((task) => task.room.id === room.id) ?? [];
    return (
      <RoomDetails
        className={cn('hidden gap-2 h-full sm:flex flex-col', className)}
        room={room}
        tasks={roomTasks}
      />
    );
  }

  // No room selected - show hotel management
  return <HotelManagement className={className} hotelId={hotelId} />;
});
