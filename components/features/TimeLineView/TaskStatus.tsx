'use client';

import { Chip, type ChipProps } from '@heroui/react';
import { capitalize, TASK_STATUS_COLORS } from '@lib/shared';
import type { TaskStatus as TTaskStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface TaskStatusProps extends Omit<ChipProps, 'children' | 'color'> {
  status: TTaskStatus;
  showLabel?: boolean;
}

export function TaskStatus({
  status,
  showLabel = true,
  ...chipProps
}: TaskStatusProps) {
  const t = useTranslations('task');

  return (
    <Chip
      color={TASK_STATUS_COLORS[status]}
      size="sm"
      variant="flat"
      {...chipProps}
    >
      {showLabel
        ? t(`status.${status}.state`, {
            default: capitalize(status, '_', 'ALL_WORDS'),
          })
        : capitalize(status, '_', 'ALL_WORDS')}
    </Chip>
  );
}
