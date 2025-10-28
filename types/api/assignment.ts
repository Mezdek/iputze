import type {
  Assignment,
  AssignmentNote,
  AssignmentStatus,
  AssignmentUser,
  Role,
  Room,
} from '@prisma/client';

import type { HotelParams, SafeUser } from '@/types';

export interface AssignmentAccessContext {
  hotelId: string;
  assignmentId: string;
  userId: string;
  assignment: Assignment;
  roles: Role[];
  isAdmin: boolean;
  isHotelManager: boolean;
  isAssignmentCleaner: boolean;
}

// Assignments

export type TAssignmentResponse = Omit<
  Assignment,
  'assignedById' | 'roomId'
> & { room: Room } & {
  notes: (Omit<AssignmentNote, 'assignmentId'> & { author: SafeUser })[];
} & {
  assignedBy: SafeUser | null;
} & {
  cleaners: (Pick<AssignmentUser, 'assignedAt'> & SafeUser)[];
} & {
  images: {
    id: string;
    url: string;
    uploadedAt: Date;
    uploader: SafeUser;
    exif?: {
      timestamp?: string;
      location?: { latitude: number; longitude: number };
      camera?: string;
      dimensions?: { width: number; height: number };
    };
  }[];
};

export interface AssignmentCreationBody {
  roomId: string;
  dueAt: Date;
  cleaners: string[];
}

export interface AssignmentUpdateBody {
  status?: AssignmentStatus;
  priority?: number;
  estimatedMinutes?: number;
  actualMinutes?: number;
  completedAt?: Date;
  startedAt?: Date;
  cancelledAt?: Date;
  cancellationNote?: string;
}

export type AssignmentCollectionParams = HotelParams;
export type AssignmentParams = AssignmentCollectionParams & {
  assignmentId: string;
};
