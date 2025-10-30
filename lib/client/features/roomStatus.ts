import { RoomCleanliness, RoomOccupancy, TaskStatus } from '@prisma/client';

import type {
  RoomStatus,
  RoomStatusInfo,
  RoomWithHotel,
  TaskResponse,
} from '@/types';

/**
 * Calculate room status based on room cleanliness and task status
 * Matches the existing logic from StatusBar.tsx
 *
 * Priority order:
 * 1. Being cleaned (IN_PROGRESS) → warning
 * 2. Has been assigned (PENDING) → warning
 * 3. Clean (no active tasks + clean room) → success
 * 4. Needs cleaning (default) → danger
 */
export function calculateRoomStatus(
  room: RoomWithHotel,
  tasks: TaskResponse[]
): RoomStatusInfo {
  // Check for active tasks (not cancelled or completed)
  const taskInProgress = tasks.some((t) => t.status === TaskStatus.IN_PROGRESS);

  const taskPending = tasks.some((t) => t.status === TaskStatus.PENDING);

  // Default status: Needs cleaning
  let statusInfo: RoomStatusInfo = {
    status: 'occupied' as RoomStatus,
    color: 'danger',
    label: 'Needs cleaning',
    priority: 'MEDIUM',
  };

  // Room is clean
  if (room.cleanliness === RoomCleanliness.CLEAN) {
    statusInfo = {
      status: 'available' as RoomStatus,
      color: 'success',
      label: 'Clean',
      priority: 'LOW',
    };
  }

  // Task in progress takes precedence
  if (taskInProgress) {
    statusInfo = {
      status: 'cleaning' as RoomStatus,
      color: 'warning',
      label: 'Being cleaned',
      priority: 'HIGH',
    };
  }

  // Task pending (if no task in progress)
  if (taskPending && !taskInProgress) {
    statusInfo = {
      status: 'occupied' as RoomStatus,
      color: 'warning',
      label: 'Has been assigned',
      priority: 'MEDIUM',
    };
  }

  // Override color if room is unavailable
  if (room.occupancy === RoomOccupancy.UNAVAILABLE) {
    statusInfo = {
      ...statusInfo,
      color: 'default',
    };
  }

  return statusInfo;
}

/**
 * Get status color class for room card styling
 */
export function getStatusColorClass(status: RoomStatus): string {
  const colorMap: Record<RoomStatus, string> = {
    available: 'bg-success-50 border-success-200',
    cleaning: 'bg-warning-50 border-warning-200',
    occupied: 'bg-danger-50 border-danger-200',
    maintenance: 'bg-default-100 border-default-300', // Kept for type compatibility
    blocked: 'bg-default-100 border-default-300', // Kept for type compatibility
  };

  return colorMap[status] || 'bg-default-50 border-default-200';
}
