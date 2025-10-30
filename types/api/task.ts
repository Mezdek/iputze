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

export interface TaskCreationBody {
  roomId: string;
  dueAt: Date;
  cleaners: string[];
}

export interface TaskUpdateBody {
  status?: TaskStatus;
  priority?: TaskPriority;
  estimatedMinutes?: number;
  actualMinutes?: number;
  completedAt?: Date;
  startedAt?: Date;
  cancelledAt?: Date;
  cancellationNote?: string;
}

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

export interface NoteWithAuthor extends Note {
  author: BasicUser;
}
