import type {
  Assignment,
  AssignmentNote,
  AssignmentUser,
  Room,
} from '@prisma/client';

import type { SafeUser, TAssignmentResponse } from '@/types';

export function transformAssignment(
  assignment: Assignment & {
    assignedUsers: (AssignmentUser & { user: SafeUser })[];
    room: Room;
    notes: AssignmentNote[];
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
