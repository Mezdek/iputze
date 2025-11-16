import {
  RoomCleanliness,
  RoomOccupancy,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import { z } from 'zod';

export const defaultCleanerSchema = z.object({ userId: z.uuid() });

export const roomCreationSchema = z.object({
  number: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9-]+$/),
  occupancy: z.enum(RoomOccupancy).optional(),
  cleanliness: z.enum(RoomCleanliness).optional(),
  type: z.string().max(50).optional(),
  capacity: z.string().min(1).max(20).optional(),
  floor: z.string().max(10).optional(),
  defaultCleaners: z.array(z.uuid()).optional(),
  notes: z.string().max(500).optional(),
});

export const roomUpdateSchema = z.object({
  number: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9-]+$/)
    .optional(),
  occupancy: z.enum(RoomOccupancy).optional(),
  cleanliness: z.enum(RoomCleanliness).optional(),
  type: z.string().max(50).optional(),
  capacity: z.number().int().min(1).max(20).optional(),
  floor: z.string().max(10).optional(),
  defaultCleaners: z.array(z.uuid()).optional(),
  notes: z.string().max(500).optional(),
});

export const taskCreationSchema = z.object({
  roomId: z.uuid('Invalid room ID'),
  dueAt: z.iso.datetime().or(z.date()),
  cleaners: z.array(z.uuid()).min(1, 'At least one cleaner required'),
  priority: z.enum(TaskPriority).optional(),
  notes: z.string().max(500).optional(),
});

export const taskUpdateSchema = z.object({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  cancelationNote: z.string().max(500).optional(),
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
  email: z.email().max(255),
  password: z.string().min(8).max(128),
});
