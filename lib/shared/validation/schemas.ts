import {
  RoomCleanliness,
  RoomOccupancy,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
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

export const roomUpdateSchema = z.object({
  number: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9-]+$/)
    .optional(),
  occupancy: z.nativeEnum(RoomOccupancy).optional(),
  cleanliness: z.nativeEnum(RoomCleanliness).optional(),
  type: z.string().max(50).optional(),
  capacity: z.number().int().min(1).max(20).optional(),
  floor: z.string().max(10).optional(),
  notes: z.string().max(500).optional(),
});

export const taskCreationSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  dueAt: z.string().datetime().or(z.date()),
  cleaners: z.array(z.string().uuid()).min(1, 'At least one cleaner required'),
  priority: z.nativeEnum(TaskPriority).optional(),
  notes: z.string().max(500).optional(),
});

export const taskUpdateSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  cancellationNote: z.string().max(500).optional(),
});

export const noteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note cannot be empty')
    .max(500, 'Note too long')
    .trim(),
});

export const userCreationSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});
