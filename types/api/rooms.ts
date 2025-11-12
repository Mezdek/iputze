import type { Hotel, Room } from '@prisma/client';
import type z from 'zod';

import type {
  roomCreationSchema,
  roomUpdateSchema,
} from '@/lib/shared/validation/schemas';
import type { BasicUser, HotelParams } from '@/types';

export type RoomCreationBody = z.infer<typeof roomCreationSchema>;

export type RoomUpdateBody = z.infer<typeof roomUpdateSchema>;

export type RoomCollectionParams = HotelParams;
export type RoomParams = RoomCollectionParams & { roomId: string };

export interface RoomWithContextRaw extends Omit<Room, 'hotelId'> {
  defaultCleaners: { assignedAt: Date; user: BasicUser }[];
  hotel: Hotel & { _count: { rooms: number } };
  _count: { tasks: number; defaultCleaners: number };
}

export interface RoomWithContext extends Omit<Room, 'hotelId'> {
  defaultCleaners: ({ assignedAt: Date } & BasicUser)[];
  hotel: Hotel;
  counts: {
    roomsInHotel: number;
    tasksInRoom: number;
    defaultCleaners: number;
  };
}
