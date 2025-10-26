import { APP_ERRORS } from '@lib/shared';
import { AssignmentStatus } from '@prisma/client';

const VALID_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  [AssignmentStatus.PENDING]: [
    AssignmentStatus.IN_PROGRESS,
    AssignmentStatus.CANCELLED,
  ],
  [AssignmentStatus.IN_PROGRESS]: [
    AssignmentStatus.COMPLETED,
    AssignmentStatus.CANCELLED,
  ],
  [AssignmentStatus.COMPLETED]: [], // Terminal state
  [AssignmentStatus.CANCELLED]: [], // Terminal state
};

export function validateStatusTransition(
  fromStatus: AssignmentStatus,
  toStatus: AssignmentStatus
): void {
  if (fromStatus === toStatus) return; // No transition

  const allowed = VALID_TRANSITIONS[fromStatus];

  if (!allowed.includes(toStatus)) {
    throw APP_ERRORS.badRequest(
      `Invalid status transition: ${fromStatus} → ${toStatus}`
    );
  }
}
