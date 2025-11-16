import type { TaskPriority } from '@prisma/client';

import type { MeResponse, RoomWithContext, TaskResponse } from '@/types';

// Actual room statuses matching existing StatusBar logic
export enum RoomStatus {
  AVAILABLE = 'available', // Clean room, no active tasks
  CLEANING = 'cleaning', // Task in progress
  OCCUPIED = 'occupied', // Needs cleaning or has been assigned
  // These kept for type compatibility but not used
  MAINTENANCE = 'maintenance',
  BLOCKED = 'blocked',
}

export interface RoomStatusInfo {
  status: RoomStatus;
  color: 'success' | 'warning' | 'danger' | 'default';
  label: string;
  priority: TaskPriority;
  description?: string;
}

export interface RoomWithStatus extends RoomWithContext {
  status: RoomStatusInfo;
  taskCount: number;
  tasks?: TaskResponse[];
}

export type FloorGroup = RoomWithStatus[];

export interface FloorMapData {
  floors: FloorGroup[] | undefined;
  selectedRoomTasks: TaskResponse[];
  isLoading: boolean;
  error: Error | null;
  hasRooms: boolean;
}

export interface FloorMapViewProps {
  room?: RoomWithContext;
  setRoom: (room?: RoomWithContext) => void;
  tasks?: TaskResponse[] | null;
  hotelId: string;
  user: MeResponse;
}
