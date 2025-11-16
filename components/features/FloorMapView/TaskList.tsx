'use client';

import { TaskItem } from '@components';
import { Card, CardBody, cn } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { sortByPriority } from '@/lib/shared/utils/sortBy';
import type { MeResponse, StatusFilterType, TaskResponse } from '@/types';

interface TaskListProps {
  tasks: TaskResponse[];
  emptyMessage?: string;
  filterStatus?: StatusFilterType;
  className?: string;
  user: MeResponse;
}

export function TaskList({
  tasks,
  emptyMessage,
  filterStatus,
  className,
  user,
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
          <p className="text-center py-8">{emptyMessage || t('empty_list')}</p>
        </CardBody>
      </Card>
    );
  }
  return (
    <div className={cn('gap-3 p-2 flex flex-col', className)}>
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} user={user} />
      ))}
    </div>
  );
}
