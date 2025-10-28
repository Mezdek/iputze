/**
 * Room-related constants and enums
 */

export const ROOM_VIEWS = {
  FLOOR_MAP: 'FLOOR_MAP',
  OVERVIEW: 'OVERVIEW',
  TIMELINE: 'TIMELINE',
} as const;

export type RoomView = (typeof ROOM_VIEWS)[keyof typeof ROOM_VIEWS];

export const ROOM_VIEW_LABELS: Record<RoomView, string> = {
  [ROOM_VIEWS.FLOOR_MAP]: 'Floor Map',
  [ROOM_VIEWS.OVERVIEW]: 'Overview',
  [ROOM_VIEWS.TIMELINE]: 'Timeline',
};

/**
 * Room status colors for occupancy
 */
export const ROOM_OCCUPANCY_COLORS = {
  VACANT: 'success',
  OCCUPIED: 'warning',
  UNAVAILABLE: 'danger',
} as const;

/**
 * Room cleanliness status colors
 */
export const ROOM_CLEANLINESS_COLORS = {
  CLEAN: 'success',
  DIRTY: 'danger',
} as const;

/**
 * Assignment status colors
 */
export const ASSIGNMENT_STATUS_COLORS = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
} as const;
