import type {
  Assignment,
  AssignmentNote,
  AssignmentUser,
  Room,
} from '@prisma/client';

import type { SafeUser, TAssignmentResponse } from '@/types';

export function transformAssignment(
  assignment: Omit<Assignment, 'assignedById' | 'roomId'> & {
    assignedUsers: (Pick<AssignmentUser, 'assignedAt'> & { user: SafeUser })[];
    room: Room;
    notes: Omit<AssignmentNote, 'assignmentId'>[];
    assignedBy: SafeUser | null;
  }
): TAssignmentResponse {
  const { assignedUsers, ...rest } = assignment;
  return {
    ...rest,
    cleaners: assignedUsers.map(({ assignedAt, user }) => ({
      ...user,
      assignedAt,
    })),
  };
}
