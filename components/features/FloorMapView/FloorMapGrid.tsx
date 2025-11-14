'use client';
import { FloorSection } from '@components';
import { cn } from '@heroui/react';
import { memo } from 'react';

import type { FloorGroup, RoomWithStatus } from '@/types';

interface FloorMapGridProps {
  floors: FloorGroup[] | undefined;
  selectedRoomId?: string;
  onRoomSelect: (room: RoomWithStatus) => void;
  className?: string;
}

export const FloorMapGrid = memo(function FloorMapGrid({
  floors,
  selectedRoomId,
  onRoomSelect,
  className,
}: FloorMapGridProps) {
  if (!floors || floors.length === 0) {
    return null;
  }

  // Sort floors in descending order (highest floor first)
  const sortedFloors = [...floors].sort((a, b) => {
    const floorA = Number(a[0]?.floor ?? 0);
    const floorB = Number(b[0]?.floor ?? 0);
    return floorB - floorA;
  });

  return (
    <div className={cn('space-y-4 overflow-y-auto h-full', className)}>
      {sortedFloors.map((floor, index) => {
        const floorNumber = Number(floor[0]?.floor ?? index);
        return (
          <FloorSection
            floor={floor}
            floorNumber={floorNumber}
            key={floorNumber}
            selectedRoomId={selectedRoomId}
            onRoomSelect={onRoomSelect}
          />
        );
      })}
    </div>
  );
});
