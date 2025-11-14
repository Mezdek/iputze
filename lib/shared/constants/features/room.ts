/**
 * Room-related constants and enums
 */

export const ROOM_VIEWS = {
  FLOOR_MAP: 'FLOOR_MAP',
  TIMELINE: 'TIMELINE',
  TASKS: 'TASKS',
  CLEANERS: 'CLEANERS',
} as const;

export type TRoomView = (typeof ROOM_VIEWS)[keyof typeof ROOM_VIEWS];

export const ROOM_VIEW_LABELS: Record<TRoomView, string> = {
  [ROOM_VIEWS.FLOOR_MAP]: 'Floor Map',
  [ROOM_VIEWS.TIMELINE]: 'Timeline',
  [ROOM_VIEWS.TASKS]: 'Tasks',
  [ROOM_VIEWS.CLEANERS]: 'Cleaners',
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
 * Task status colors
 */
export const TASK_STATUS_COLORS = {
  PENDING: 'warning',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
} as const;
