'use client';

import {
  AssignmentDetail,
  AssignmentList,
  RoomCreation,
  RoomDetails,
} from '@components';
import { Button, Card, cn } from '@heroui/react';
import { memo, useState } from 'react';

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
  const [selectedAssignment, setSelectedAssignment] =
    useState<TAssignmentResponse | null>(null);

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
            onPress={onClose}
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

  // No room selected - show creation and assignments overview
  return (
    <>
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
          <RoomCreation hotelId={hotelId} />

          {/* Show assignments overview when no room is selected */}
          {tasks && tasks.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold">All Assignments</h4>
              <AssignmentList
                assignments={tasks}
                emptyMessage="No assignments available"
                onAssignmentClick={setSelectedAssignment}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <AssignmentDetail
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          viewMode="manager"
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </>
  );
});
