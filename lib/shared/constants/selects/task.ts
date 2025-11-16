export const taskSelect = {
  id: true,
  status: true,
  priority: true,
  dueAt: true,
  startedAt: true,
  completedAt: true,
  canceledAt: true,
  createdAt: true,
  cancelationNote: true,
  deletedAt: true,
  _count: {
    select: { cleaners: true, notes: true, images: true },
  },

  room: true,
  notes: {
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  },

  images: {
    where: { deletedAt: null },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { uploadedAt: 'desc' },
  },

  creator: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },

  deletor: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  canceler: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  cleaners: {
    select: {
      assignedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  },
} as const;
