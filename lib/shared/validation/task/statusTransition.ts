import { TaskStatus } from '@prisma/client';

import { APP_ERRORS } from '@/lib/shared/errors/api/factories';

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.CANCELED],
  [TaskStatus.COMPLETED]: [], // Terminal state
  [TaskStatus.CANCELED]: [], // Terminal state
};

export function validateStatusTransition(
  fromStatus: TaskStatus,
  toStatus?: TaskStatus
): void {
  if (fromStatus === toStatus || !toStatus) return; // No transition

  const allowed = VALID_TRANSITIONS[fromStatus];

  if (!allowed.includes(toStatus)) {
    throw APP_ERRORS.badRequest(
      `Invalid status transition: ${fromStatus} → ${toStatus}`
    );
  }
}
