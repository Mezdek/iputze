'use client';

import { RoomCreation } from '@components';
import { Card } from '@heroui/react';
import { memo } from 'react';

interface EmptyFloorStateProps {
  hotelId: string;
}

export const EmptyFloorState = memo(function EmptyFloorState({
  hotelId,
}: EmptyFloorStateProps) {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="max-w-lg p-8">
        <div className="text-center space-y-6">
          <div className="text-6xl">🏨</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">No Rooms Yet</h3>
            <p className="text-default-500">
              Start by creating your first room to see the floor map
            </p>
          </div>
          <RoomCreation hotelId={hotelId} />
        </div>
      </Card>
    </div>
  );
});
