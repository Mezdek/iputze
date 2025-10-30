'use client';

import { TaskActions, TaskStatus } from '@components';
import { Chip } from '@heroui/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import type { InjectedAuthProps, TaskResponse } from '@/types';

interface TaskHeaderProps extends InjectedAuthProps {
  task: TaskResponse;
  showActions?: boolean;
}

export function TaskHeader({
  task,
  user,
  showActions = true,
}: TaskHeaderProps) {
  const t = useTranslations('task');
  const { room, status, dueAt, priority } = task;

  const isOverdue = new Date(dueAt) < new Date() && status !== 'COMPLETED';

  return (
    <div className="flex flex-col gap-3">
      {/* Title and Status */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-lg font-bold" id={`task-${task.id}-title`}>
            {t('header', { number: room.number })}
          </h2>

          <div className="flex gap-2 flex-wrap items-center">
            <TaskStatus status={status} />

            {priority > 0 && (
              <Chip color="warning" size="sm" variant="flat">
                {t('priority')}: {priority}
              </Chip>
            )}

            {isOverdue && (
              <Chip color="danger" size="sm" variant="flat">
                {t('overdue')}
              </Chip>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && <TaskActions task={task} user={user} />}
      </div>

      {/* Due Date Highlight if Overdue */}
      {isOverdue && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-2 text-sm">
          <span className="text-danger font-semibold">
            {t('due_date_passed')}:{' '}
          </span>
          <span className="text-danger">
            {format(new Date(dueAt), 'MMM dd, yyyy - HH:mm')}
          </span>
        </div>
      )}
    </div>
  );
}
