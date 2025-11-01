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
  isAdmin: boolean;
  isHotelManager: boolean;
  isTaskCleaner: boolean;
}

// Tasks
export interface TaskResponse extends Omit<Task, 'assignedById' | 'roomId'> {
  room: Room;
  images: ImageResponse[];
  cleaners: TransformedCleaner[];
  assignedBy: BasicUser | null;
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
  extends Omit<Task, 'assignedById' | 'roomId'> {
  room: Room;
  notes: (Note & { author: BasicUser })[];
  images: ImageWithUploader[];
  assignedBy: BasicUser | null;
  cleaners: (Pick<Cleaner, 'assignedAt'> & { user: BasicUser })[];
}

export interface TransformedCleaner
  extends Pick<Cleaner, 'assignedAt'>,
    BasicUser {}
