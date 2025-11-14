'use client';

import { RoomDetails, StatusFilter, TaskDetail, TaskList } from '@components';
import { Button, Card } from '@heroui/react';
import { memo, useState } from 'react';

import type { RoomWithContext, StatusFilterType, TaskResponse } from '@/types';

interface TasksViewProps {
  room?: RoomWithContext;
  tasks?: TaskResponse[] | null;
  onClose?: () => void;
  taskListClassName?: string;
}

export const TasksView = memo(function TasksView({
  room,
  tasks,
  onClose,
  taskListClassName,
}: TasksViewProps) {
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const hasTasks: boolean = !!tasks && tasks.length > 0;
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  // Room selected - show room details
  if (room) {
    const roomTasks = tasks?.filter((task) => task.room.id === room.id) ?? [];
    return (
      <div className="hidden flex-col gap-2 h-full sm:flex">
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
        <RoomDetails className="flex-1" room={room} tasks={roomTasks} />
      </div>
    );
  }

  // No room selected - show creation and tasks overview
  return (
    <Card className="flex flex-col gap-4 p-4 h-full w-full">
      <div className="flex justify-between space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
      </div>

      {/* Show tasks overview when no room is selected */}
      <StatusFilter
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      {hasTasks && (
        <div
          className="flex flex-col gap-2 h-full overflow-y-scroll w-full"
          style={{ scrollbarWidth: 'none' }}
        >
          <TaskList
            className={taskListClassName}
            emptyMessage="No tasks available"
            filterStatus={statusFilter === 'all' ? undefined : statusFilter}
            tasks={tasks ?? []}
            onTaskClick={setSelectedTask}
          />
        </div>
      )}
      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          isOpen={!!selectedTask}
          task={selectedTask}
          viewMode="manager"
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Card>
  );
});
