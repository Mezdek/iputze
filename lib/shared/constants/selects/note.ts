export const noteSelect = {
  content: true,
  createdAt: true,
  deletedAt: true,
  id: true,
  taskId: true,
  author: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
  task: {
    select: {
      id: true,
      room: { select: { hotelId: true, id: true } },
    },
  },
} as const;
