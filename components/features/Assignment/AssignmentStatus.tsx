'use client';

import { Chip, type ChipProps } from '@heroui/react';
import { ASSIGNMENT_STATUS_COLORS, capitalize } from '@lib/shared';
import type { AssignmentStatus as TAssignmentStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface AssignmentStatusProps extends Omit<ChipProps, 'children' | 'color'> {
  status: TAssignmentStatus;
  showLabel?: boolean;
}

export function AssignmentStatus({
  status,
  showLabel = true,
  ...chipProps
}: AssignmentStatusProps) {
  const t = useTranslations('assignment');

  return (
    <Chip
      color={ASSIGNMENT_STATUS_COLORS[status]}
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
