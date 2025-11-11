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
