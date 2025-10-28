import type {
  Assignment,
  AssignmentImage,
  AssignmentNote,
  AssignmentUser,
  Room,
} from '@prisma/client';

import type { SafeUser, TAssignmentResponse } from '@/types';

export function transformAssignment(
  assignment: TTransformAssignmentProps
): TAssignmentResponse {
  const { assignedUsers, AssignmentImage, ...rest } = assignment;
  return {
    ...rest,
    cleaners: assignedUsers.map(({ assignedAt, user }) => ({
      ...user,
      assignedAt,
    })),
    images: AssignmentImage,
  };
}

type TTransformAssignmentProps = Omit<Assignment, 'assignedById' | 'roomId'> & {
  room: Room;
  notes: (Omit<AssignmentNote, 'assignmentId'> & {
    author: SafeUser;
  })[];
  AssignmentImage: (Omit<AssignmentImage, 'assignmentId' | 'uploadedBy'> & {
    uploader: SafeUser;
    exif?: {
      timestamp?: string;
      location?: { latitude: number; longitude: number };
      camera?: string;
      dimensions?: { width: number; height: number };
    };
  })[];
  assignedBy: SafeUser | null;
  assignedUsers: (Pick<AssignmentUser, 'assignedAt'> & { user: SafeUser })[];
};
