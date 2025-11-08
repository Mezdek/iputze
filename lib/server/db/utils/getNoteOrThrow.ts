import type { Hotel, Note, Room, Task } from '@prisma/client';

import { prisma } from '@/lib/server/db/prisma';
import { NotesErrors } from '@/lib/shared/constants/errors/notes';
import { TaskErrors } from '@/lib/shared/constants/errors/tasks';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';

/**
 * Type that includes an Note with its task,
 * room, and hotel context for validation purposes.
 */
export type NoteWithContext = Note & {
  task: Task & {
    room: Room & {
      hotel: Hotel;
    };
  };
};

/**
 * Parameters for validating an task note.
 */
export type NoteContext = {
  noteId: string;
  expectedTaskId?: string;
  expectedHotelId?: string;
  expectedAuthorId?: string;
};

/**
 * Retrieves an note by ID and validates its context.
 *
 * Validation includes:
 * - Existence of the note.
 * - Correct task (if `expectedTaskId` is provided).
 * - Correct hotel (if `expectedHotelId` is provided).
 * - Correct author (if `expectedAuthorId` is provided).
 * - Ensures the note belongs to a non-floating task (linked to a room).
 *
 * @param ctx - Context parameters for validation.
 * @returns The validated Note with task, room, and hotel.
 * @throws {HttpError} If validation fails.
 */
export const getNoteOrThrow = async (
  ctx: NoteContext
): Promise<NoteWithContext> => {
  const { noteId, expectedTaskId, expectedHotelId, expectedAuthorId } = ctx;

  // Fetch note with full context
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      task: {
        select: {
          id: true,
          room: {
            select: {
              id: true,
              hotel: true,
            },
          },
        },
      },
    },
  });

  if (!note) {
    throw APP_ERRORS.badRequest(NotesErrors.NOT_FOUND);
  }

  // Ensure task is not floating (must be tied to a room)
  if (!note.task.room) throw APP_ERRORS.badRequest(TaskErrors.FLOATING);

  // Check task match
  if (expectedTaskId && note.task.id !== expectedTaskId)
    throw APP_ERRORS.forbidden(NotesErrors.NOT_IN_TASK);

  // Check hotel match
  if (expectedHotelId && note.task.room.hotel.id !== expectedHotelId)
    throw APP_ERRORS.forbidden(NotesErrors.NOT_IN_HOTEL);

  // Check author match
  if (expectedAuthorId && note.authorId !== expectedAuthorId)
    throw APP_ERRORS.forbidden(NotesErrors.EDITING_DENIED);

  return note as NoteWithContext;
};
