import type { Hotel } from '@prisma/client';

export interface HotelCreationBody {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export type PublicHotel = Omit<Hotel, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type HotelParams = { hotelId: string };
