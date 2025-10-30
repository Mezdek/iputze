import { APP_ERRORS, AuthErrors } from '@lib/shared';
import { RoomCleanliness, RoomOccupancy, TaskStatus } from '@prisma/client';
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

export const taskCreationSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  dueAt: z.string().datetime().or(z.date()),
  cleaners: z.array(z.string().uuid()).min(1, 'At least one cleaner required'),
  estimatedMinutes: z.number().int().positive().optional(),
  priority: z.number().int().min(0).max(2).default(0),
});

export const noteSchema = z.object({
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

export const taskUpdateSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.number().int().min(0).max(2).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  actualMinutes: z.number().int().positive().optional(),
  completedAt: z.date().optional(),
  startedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  cancellationNote: z.string().max(500).optional(),
});

/**
 * Schemas
 */
export const nameSchema = z.string().min(1).max(255).trim();
export const emailSchema = z.string().email().max(255);
export const passwordSchema = z.string().min(8).max(128);

/**
 * Generic validator for registration
 */
export const validateRegistration = (data: unknown) => {
  const result = z
    .object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
    })
    .safeParse(data);

  if (!result.success) {
    throw APP_ERRORS.badRequest(AuthErrors.INVALID_VALUES);
  }

  return result.data;
};
