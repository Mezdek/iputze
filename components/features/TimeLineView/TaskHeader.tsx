'use client';

import { OverdueChip, TaskActions, TaskStatus } from '@components';
import { Chip } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { capitalize } from '@/lib/shared/utils/capitalize';
import type { MeResponse, TaskResponse } from '@/types';

interface TaskHeaderProps {
  task: TaskResponse;
  user: MeResponse;
  onClose: () => void;
}

export function TaskHeader({ task, user, onClose }: TaskHeaderProps) {
  const t = useTranslations('task');
  const { room, status, dueAt, priority } = task;

  const isOverdue = new Date(dueAt) < new Date() && status !== 'COMPLETED';

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold" id={`task-${task.id}-title`}>
          {t('header', { number: room.number })}
        </h2>
        <OverdueChip isOverdue={isOverdue} />
        <div className="flex gap-2 flex-wrap items-center">
          <TaskStatus status={status} />

          <Chip color="warning" size="sm" variant="flat">
            {capitalize(priority)}
          </Chip>
        </div>
      </div>

      <TaskActions task={task} user={user} />
    </div>
  );
}
