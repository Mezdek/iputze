'use client';

import { RoomCard } from '@components';
import { Card } from '@heroui/react';
import { memo } from 'react';

import type { FloorGroup } from '@/types';

interface FloorSectionProps {
  floor: FloorGroup;
  floorNumber: number;
  selectedRoomId?: string;
  onRoomSelect: (room: FloorGroup[0]) => void;
}

export const FloorSection = memo(function FloorSection({
  floor,
  floorNumber,
  selectedRoomId,
  onRoomSelect,
}: FloorSectionProps) {
  if (floor.length === 0) return null;

  return (
    <Card className="p-4">
      {/* Floor header */}
      <div className="mb-3 pb-2 border-b border-divider">
        <h3 className="text-lg font-semibold text-foreground">
          Floor {floorNumber}
        </h3>
        <p className="text-xs text-default-500">
          {floor.length} {floor.length === 1 ? 'room' : 'rooms'}
        </p>
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {floor.map((room) => (
          <RoomCard
            isSelected={selectedRoomId === room.id}
            key={room.id}
            room={room}
            onClick={() => onRoomSelect(room)}
          />
        ))}
      </div>
    </Card>
  );
});
