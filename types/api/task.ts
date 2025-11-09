import type {
  Cleaner,
  Note,
  Role,
  Room,
  Task,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

import type {
  BasicUser,
  HotelParams,
  ImageResponse,
  ImageWithUploader,
  NoteWithAuthor,
} from '@/types';

export interface TaskAccessContext {
  hotelId: string;
  taskId: string;
  userId: string;
  task: Task;
  roles: Role[];
  cleaners: Cleaner[];
}

// Tasks
export interface TaskResponse
  extends Omit<Task, 'creatorId' | 'roomId' | 'deletorId'> {
  _count: {
    notes: number;
    images: number;
    cleaners: number;
  };
  room: Room;
  images: ImageResponse[];
  cleaners: TransformedCleaner[];
  creator: BasicUser | null;
  deletor: BasicUser | null;
  notes: NoteWithAuthor[];
}

export type TaskCreationBody = {
  roomId: string;
  dueAt: string | Date;
  cleaners: string[];
  priority?: TaskPriority | undefined;
  notes?: string | undefined;
};

export type TaskUpdateBody = {
  status?: TaskStatus | undefined;
  priority?: TaskPriority | undefined;
  completedAt?: Date | undefined;
  startedAt?: Date | undefined;
  cancelledAt?: Date | undefined;
  cancellationNote?: string | undefined;
};

export type TaskCollectionParams = HotelParams;
export type TaskParams = TaskCollectionParams & {
  taskId: string;
};

export interface TransformTaskProps
  extends Omit<Task, 'creatorId' | 'roomId' | 'deletorId'> {
  _count: {
    notes: number;
    images: number;
    cleaners: number;
  };
  room: Room;
  notes: (Note & { author: BasicUser })[];
  images: ImageWithUploader[];
  creator: BasicUser | null;
  deletor: BasicUser | null;
  cleaners: (Pick<Cleaner, 'assignedAt'> & { user: BasicUser })[];
}

export type TransformedCleaner = Pick<Cleaner, 'assignedAt'> & BasicUser;
