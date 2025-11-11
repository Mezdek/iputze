export const roomSelect = {
  number: true,
  id: true,
  occupancy: true,
  cleanliness: true,
  notes: true,
  type: true,
  capacity: true,
  floor: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  defaultCleaners: {
    select: {
      assignedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  },

  hotel: {
    select: {
      address: true,
      createdAt: true,
      deletedAt: true,
      description: true,
      email: true,
      id: true,
      name: true,
      phone: true,
      updatedAt: true,
      _count: { select: { rooms: true } },
    },
  },

  _count: {
    select: {
      tasks: true,
      defaultCleaners: true,
    },
  },
} as const;
