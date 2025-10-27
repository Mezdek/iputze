'use client';

import {
  EmptyFloorState,
  FloorMapError,
  FloorMapGrid,
  FloorMapSidebar,
  FloorMapSkeleton,
} from '@components';
import { useFloorMapData } from '@hooks';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';

import type { FloorMapViewProps } from '@/types';

export function FloorMapView({ room, setRoom }: FloorMapViewProps) {
  const { hotelId } = useParams<{ hotelId: string }>();

  const { floors, selectedRoomTasks, isLoading, error, hasRooms } =
    useFloorMapData({
      hotelId,
      selectedRoomId: room?.id,
    });

  const handleRoomSelect = useCallback(
    (selectedRoom: typeof room) => {
      setRoom(selectedRoom);
    },
    [setRoom]
  );

  const handleClearSelection = useCallback(() => {
    setRoom(undefined);
  }, [setRoom]);

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
        className="lg:col-span-5 h-full"
        floors={floors}
        selectedRoomId={room?.id}
        onRoomSelect={handleRoomSelect}
      />

      {/* Sidebar */}
      <FloorMapSidebar
        className="lg:col-span-2"
        hotelId={hotelId}
        room={room}
        tasks={selectedRoomTasks}
        onClose={handleClearSelection}
      />
    </div>
  );
}
