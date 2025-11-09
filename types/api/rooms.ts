import type {
  Hotel,
  Room,
  RoomCleanliness,
  RoomOccupancy,
} from '@prisma/client';

import type { BasicUser, HotelParams } from '@/types';

export type RoomCreationBody = {
  number: string;
  occupancy?: RoomOccupancy | undefined;
  cleanliness?: RoomCleanliness | undefined;
  type?: string | undefined;
  capacity?: number | undefined;
  floor?: string | undefined;
  notes?: string | undefined;
};

export type RoomUpdateBody = {
  number?: string | undefined;
  occupancy?: RoomOccupancy | undefined;
  cleanliness?: RoomCleanliness | undefined;
  type?: string | undefined;
  capacity?: number | undefined;
  floor?: string | undefined;
  notes?: string | undefined;
};

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
