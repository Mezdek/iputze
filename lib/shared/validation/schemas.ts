import {
  AssignmentStatus,
  RoomCleanliness,
  RoomOccupancy,
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

export const assignmentCreationSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  dueAt: z.string().datetime().or(z.date()),
  cleaners: z.array(z.string().uuid()).min(1, 'At least one cleaner required'),
  estimatedMinutes: z.number().int().positive().optional(),
  priority: z.number().int().min(0).max(2).default(0),
});

export const assignmentNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note cannot be empty')
    .max(500, 'Note too long')
    .trim(),
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

export const assignmentUpdateSchema = z.object({
  status: z.nativeEnum(AssignmentStatus).optional(),
  priority: z.number().int().min(0).max(2).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  actualMinutes: z.number().int().positive().optional(),
  completedAt: z.date().optional(),
  startedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  cancellationNote: z.string().max(500).optional(),
});
