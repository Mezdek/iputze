'use client';

import { addToast, Button } from '@heroui/react';
import { useErrorToast, useUpdateTask } from '@hooks';
import { TaskStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { capitalize } from '@/lib/shared/utils/capitalize';
import { isTaskCleaner } from '@/lib/shared/utils/permissions';
import type { InjectedAuthProps, TaskResponse } from '@/types';

const NEXT_STATUS = {
  [TaskStatus.PENDING]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.COMPLETED,
} as const;

interface TaskActionsProps extends InjectedAuthProps {
  task: TaskResponse;
  compact?: boolean;
}

export function TaskActions({ task, user, compact = false }: TaskActionsProps) {
  const t = useTranslations('task');
  const { showErrorToast } = useErrorToast();

  const {
    id: taskId,
    status,
    cleaners,
    room: { hotelId },
  } = task;

  const { mutateAsync: update, isPending } = useUpdateTask({
    taskId,
    hotelId,
  });

  const isTaskCleanerFlag = isTaskCleaner({ cleaners, userId: user.id });

  // Only show actions for assigned cleaners and non-completed tasks
  if (!isTaskCleanerFlag || status === TaskStatus.COMPLETED) {
    return null;
  }

  // Check if status can transition
  const nextStatus =
    status === TaskStatus.PENDING || status === TaskStatus.IN_PROGRESS
      ? NEXT_STATUS[status]
      : null;

  if (!nextStatus) return null;

  const handleStatusChange = async () => {
    try {
      await update({ status: nextStatus });
      addToast({
        title: t('status_changed', { default: 'Status Changed!' }),
        description: t('status_changed_desc', {
          status: capitalize(nextStatus, '_', 'ALL_WORDS'),
        }),
        color: 'success',
      });
    } catch (e) {
      showErrorToast(e);
    }
  };

  const buttonText = t(`status.${status}.button`, {
    default: status === TaskStatus.PENDING ? 'Start' : 'Complete',
  });

  return (
    <Button
      className={compact ? 'text-sm' : 'rounded-lg text-sm font-medium'}
      color={status === TaskStatus.PENDING ? 'primary' : 'success'}
      isDisabled={isPending}
      isLoading={isPending}
      size={compact ? 'sm' : 'md'}
      onPress={handleStatusChange}
    >
      {buttonText}
    </Button>
  );
}
