import type {
  Note,
  Role,
  Room,
  Task,
  TaskPriority,
  TaskStatus,
  TaskUser,
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
  cleaners: Cleaner[];
  assignedBy: BasicUser | null;
  notes: NoteWithAuthor[];
}

export type TaskCreationBody = {
  roomId: string;
  dueAt: string | Date;
  cleaners: string[];
  estimatedMinutes?: number | undefined;
  priority?: TaskPriority | undefined;
  notes?: string | undefined;
};

export type TaskUpdateBody = {
  status?: TaskStatus | undefined;
  priority?: TaskPriority | undefined;
  estimatedMinutes?: number | undefined;
  actualMinutes?: number | undefined;
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
  cleaners: (Pick<TaskUser, 'assignedAt'> & { user: BasicUser })[];
}

export interface Cleaner extends Pick<TaskUser, 'assignedAt'>, BasicUser {}
