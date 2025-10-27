import type { RoomWithHotel, TAssignmentResponse } from '@/types';

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
  priority: number;
  description?: string;
}

export interface RoomWithStatus extends RoomWithHotel {
  status: RoomStatusInfo;
  taskCount: number;
  tasks?: TAssignmentResponse[];
}

export type FloorGroup = RoomWithStatus[];

export interface FloorMapData {
  floors: FloorGroup[] | undefined;
  selectedRoomTasks: TAssignmentResponse[];
  isLoading: boolean;
  error: Error | null;
  hasRooms: boolean;
}

export interface FloorMapViewProps {
  room: RoomWithHotel | undefined;
  setRoom: (room: RoomWithHotel | undefined) => void;
}
