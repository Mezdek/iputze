import type {
  Hotel,
  Room,
  RoomCleanliness,
  RoomOccupancy,
} from '@prisma/client';

import type { HotelParams } from '@/types';

export interface RoomWithHotel extends Room {
  hotel: Hotel;
}

export interface RoomCreationBody {
  number: string;
  occupancy?: RoomOccupancy;
  cleanliness?: RoomCleanliness;
  type?: string;
  capacity?: number;
  floor?: string;
  notes?: string;
}

export interface RoomUpdateBody {
  number?: string;
  occupancy?: RoomOccupancy;
  cleanliness?: RoomCleanliness;
  type?: string;
  capacity?: number;
  floor?: string;
  notes?: string;
}

export type RoomCollectionParams = HotelParams;
export type RoomParams = RoomCollectionParams & { roomId: string };
