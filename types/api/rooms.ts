import type {
  DefaultCleaners,
  Hotel,
  Room,
  RoomCleanliness,
  RoomOccupancy,
} from '@prisma/client';

import type { HotelParams } from '@/types';

export interface RoomWithHotel extends Room {
  hotel: Hotel;
}

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

export interface RoomResponse extends Room {
  defaultCleaners: DefaultCleaners[];
}
