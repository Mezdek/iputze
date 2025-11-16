'use client';

import {
  EmptyFloorState,
  FloorMapError,
  FloorMapGrid,
  FloorMapSkeleton,
} from '@components';
import { useFloorMapData } from '@hooks';
import { useCallback } from 'react';

import { FloorMapSideBar } from '@/components/features/FloorMapView/FloorMapSideBar';
import type { FloorMapViewProps } from '@/types';

export function FloorMapView({
  room,
  setRoom,
  tasks,
  hotelId,
  user,
}: FloorMapViewProps) {
  const { floors, isLoading, error, hasRooms } = useFloorMapData({
    hotelId,
    selectedRoomId: room?.id,
  });

  const handleRoomSelect = useCallback(
    (selectedRoom: typeof room) => {
      setRoom(selectedRoom);
    },
    [setRoom]
  );

  // Loading state
  if (isLoading) {
    return <FloorMapSkeleton />;
  }

  // Error state
  if (error) {
    return <FloorMapError error={error} />;
  }

  // Empty state
  if (!hasRooms) {
    return <EmptyFloorState hotelId={hotelId} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 p-2 h-full">
      {/* Floor map grid */}
      <FloorMapGrid
        className="lg:col-span-5"
        floors={floors}
        selectedRoomId={room?.id}
        onRoomSelect={handleRoomSelect}
      />
      {/* Sidebar */}
      <FloorMapSideBar
        className="hidden lg:flex lg:col-span-2"
        hotelId={hotelId}
        room={room}
        tasks={tasks}
        user={user}
      />
    </div>
  );
}
