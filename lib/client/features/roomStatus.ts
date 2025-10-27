import {
  AssignmentStatus,
  RoomCleanliness,
  RoomOccupancy,
} from '@prisma/client';

import type {
  RoomStatus,
  RoomStatusInfo,
  RoomWithHotel,
  TAssignmentResponse,
} from '@/types';

/**
 * Calculate room status based on room cleanliness and assignment status
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
  tasks: TAssignmentResponse[]
): RoomStatusInfo {
  // Check for active tasks (not cancelled or completed)
  const taskInProgress = tasks.some(
    (t) => t.status === AssignmentStatus.IN_PROGRESS
  );

  const taskPending = tasks.some((t) => t.status === AssignmentStatus.PENDING);

  // Default status: Needs cleaning
  let statusInfo: RoomStatusInfo = {
    status: 'occupied' as RoomStatus,
    color: 'danger',
    label: 'Needs cleaning',
    priority: 1,
  };

  // Room is clean
  if (room.cleanliness === RoomCleanliness.CLEAN) {
    statusInfo = {
      status: 'available' as RoomStatus,
      color: 'success',
      label: 'Clean',
      priority: 0,
    };
  }

  // Task in progress takes precedence
  if (taskInProgress) {
    statusInfo = {
      status: 'cleaning' as RoomStatus,
      color: 'warning',
      label: 'Being cleaned',
      priority: 2,
    };
  }

  // Task pending (if no task in progress)
  if (taskPending && !taskInProgress) {
    statusInfo = {
      status: 'occupied' as RoomStatus,
      color: 'warning',
      label: 'Has been assigned',
      priority: 1,
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

/**
 * Sort rooms by status priority (highest first) then by room number
 */
export function sortRoomsByStatus(
  rooms: Array<{ status: RoomStatusInfo; number: string }>
): typeof rooms {
  return [...rooms].sort((a, b) => {
    // Sort by priority descending
    if (a.status.priority !== b.status.priority) {
      return b.status.priority - a.status.priority;
    }
    // Then by room number ascending
    return a.number.localeCompare(b.number, undefined, { numeric: true });
  });
}

/**
 * Filter rooms by status
 */
export function filterRoomsByStatus(
  rooms: Array<{ status: RoomStatusInfo }>,
  statusFilter: RoomStatus | 'all'
): typeof rooms {
  if (statusFilter === 'all') return rooms;
  return rooms.filter((room) => room.status.status === statusFilter);
}
