import { RoomCleanliness, RoomOccupancy } from '@prisma/client';
import { z } from 'zod';

export const roomCreationSchema = z.object({
  number: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9-]+$/),
  occupancy: z.nativeEnum(RoomOccupancy).optional(),
  cleanliness: z.nativeEnum(RoomCleanliness).optional(),
  type: z.string().max(50).optional(),
  capacity: z.number().int().min(1).max(20).optional(),
  floor: z.string().max(10).optional(),
  notes: z.string().max(500).optional(),
});
