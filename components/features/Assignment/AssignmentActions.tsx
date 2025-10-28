'use client';

import { addToast, Button } from '@heroui/react';
import { useErrorToast, useUpdateAssignment } from '@hooks';
import { isAssignmentCleaner } from '@lib/server';
import { capitalize } from '@lib/shared';
import { AssignmentStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

import type { InjectedAuthProps, TAssignmentResponse } from '@/types';

const NEXT_STATUS = {
  [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
  [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.COMPLETED,
} as const;

interface AssignmentActionsProps extends InjectedAuthProps {
  assignment: TAssignmentResponse;
  compact?: boolean;
}

export function AssignmentActions({
  assignment,
  user,
  compact = false,
}: AssignmentActionsProps) {
  const t = useTranslations('assignment');
  const { showErrorToast } = useErrorToast();

  const {
    id: assignmentId,
    status,
    cleaners,
    room: { hotelId },
  } = assignment;

  const { mutateAsync: update, isPending } = useUpdateAssignment({
    assignmentId,
    hotelId,
  });

  const isAssignmentCleanerFlag = isAssignmentCleaner({ cleaners, user });

  // Only show actions for assigned cleaners and non-completed assignments
  if (!isAssignmentCleanerFlag || status === AssignmentStatus.COMPLETED) {
    return null;
  }

  // Check if status can transition
  const nextStatus =
    status === AssignmentStatus.PENDING ||
    status === AssignmentStatus.IN_PROGRESS
      ? NEXT_STATUS[status]
      : null;

  if (!nextStatus) return null;

  const handleStatusChange = async () => {
    try {
      await update({ status: nextStatus });
      addToast({
        title: t('status_changed', { default: 'Status Changed!' }),
        description: t('status_changed_desc', {
          default: `Assignment set to ${capitalize(nextStatus, '_', 'ALL_WORDS')}`,
          status: capitalize(nextStatus, '_', 'ALL_WORDS'),
        }),
        color: 'success',
      });
    } catch (e) {
      showErrorToast(e);
    }
  };

  const buttonText = t(`status.${status}.button`, {
    default: status === AssignmentStatus.PENDING ? 'Start' : 'Complete',
  });

  return (
    <Button
      className={compact ? 'text-sm' : 'rounded-lg text-sm font-medium'}
      color={status === AssignmentStatus.PENDING ? 'primary' : 'success'}
      isDisabled={isPending}
      isLoading={isPending}
      size={compact ? 'sm' : 'md'}
      onPress={handleStatusChange}
    >
      {buttonText}
    </Button>
  );
}
