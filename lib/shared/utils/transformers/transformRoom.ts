import type { RoomWithContext, RoomWithContextRaw } from '@/types';

export function transformRoom(room: RoomWithContextRaw): RoomWithContext {
  const { _count, hotel, defaultCleaners, ...roomFields } = room;
  const defaultCleanersFlattened = defaultCleaners.map(
    ({ assignedAt, user }) => ({
      assignedAt,
      ...user,
    })
  );
  const {
    _count: { rooms: roomsInHotel },
    ...hotelFields
  } = hotel;

  return {
    ...roomFields,
    defaultCleaners: defaultCleanersFlattened,
    hotel: hotelFields,
    counts: {
      roomsInHotel,
      tasksInRoom: _count.tasks,
      defaultCleaners: _count.defaultCleaners,
    },
  };
}

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
};
