export const ErrorCodes = {
  room: {
    UNKNOWN: 'unknown',
    CREATION: {
      DUPLICATE: 'duplicate_room_number_creation',
    },
    DELETION: {
      HAS_TASKS: 'room_has_tasks',
    },
    UPDATE: {
      DUPLICATE: 'duplicate_room_number_update',
    },
  },
  task: {
    UNKNOWN: 'unknown',
  },
} as const;
