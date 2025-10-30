'use client';

import { RoomCreation, RoomDetails, TaskDetail, TaskList } from '@components';
import { Button, Card, cn } from '@heroui/react';
import { memo, useState } from 'react';

import { useTasks } from '@/hooks';
import type { RoomWithHotel, TaskResponse } from '@/types';

interface FloorMapSidebarProps {
  room: RoomWithHotel | undefined;
  tasks: TaskResponse[];
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
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const { data: allTasks } = useTasks({ hotelId });
  console.log({ allTasks });
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

  // No room selected - show creation and tasks overview
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

        <div className="space-y-4 h-full">
          <RoomCreation hotelId={hotelId} />

          {/* Show tasks overview when no room is selected */}
          {allTasks && allTasks.length > 0 && (
            <div className="flex flex-col gap-2 h-full w-full">
              <h4 className="text-sm font-semibold">All Tasks</h4>
              <div
                className="flex flex-col gap-2 h-[640px] overflow-y-scroll w-full"
                style={{ scrollbarWidth: 'none' }}
              >
                <TaskList
                  emptyMessage="No tasks available"
                  tasks={allTasks}
                  onTaskClick={setSelectedTask}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          isOpen={!!selectedTask}
          task={selectedTask}
          viewMode="manager"
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
});
