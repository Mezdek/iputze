'use client';

import { TaskItem } from '@components';
import { Card, CardBody } from '@heroui/react';
import type { TaskStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { sortByPriority } from '@/lib/shared/utils/sortBy';
import type { TaskResponse } from '@/types';

interface TaskListProps {
  tasks: TaskResponse[];
  onTaskClick?: (task: TaskResponse) => void;
  emptyMessage?: string;
  filterStatus?: TaskStatus;
}

export function TaskList({
  tasks,
  onTaskClick,
  emptyMessage,
  filterStatus,
}: TaskListProps) {
  const t = useTranslations('task');

  // Filter tasks if filterStatus is provided
  const filteredTasks = filterStatus
    ? tasks.filter((a) => a.status === filterStatus)
    : tasks;

  // Sort by priority (descending) then by dueAt (ascending)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by priority
    if (a.priority !== b.priority) {
      return sortByPriority(a, b);
    }
    // Then by due date
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  });

  if (sortedTasks.length === 0) {
    return (
      <Card className="shadow-none bg-default-50">
        <CardBody>
          <p className="text-center text-default-500 py-8">
            {emptyMessage || t('empty_list')}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-2">
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </div>
  );
}
