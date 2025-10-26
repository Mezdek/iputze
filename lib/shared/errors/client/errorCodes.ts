export const ErrorCodes = {
  room: {
    UNKNOWN: 'unknown',
    CREATION: {
      DUPLICATE: 'duplicate_room_number_creation',
    },
    DELETION: {
      HAS_ASSIGNMENTS: 'room_has_assignments',
    },
    UPDATE: {
      DUPLICATE: 'duplicate_room_number_update',
    },
  },
  assignment: {
    UNKNOWN: 'unknown',
  },
} as const;
