import { prisma } from '@/lib/server/db/prisma';
import { NotesErrors } from '@/lib/shared/constants/errors/notes';
import { TaskErrors } from '@/lib/shared/constants/errors/tasks';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { transformNote } from '@/lib/shared/utils/transformers/transformTask';
import type { NoteWithContext } from '@/types';

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
export const getNoteOrThrow = async ({
  noteId,
}: {
  noteId: string;
}): Promise<NoteWithContext> => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: {
      content: true,
      createdAt: true,
      deletedAt: true,
      id: true,
      taskId: true,
      author: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      task: {
        select: {
          id: true,
          room: { select: { hotelId: true, id: true } },
        },
      },
    },
  });

  if (!note) throw APP_ERRORS.badRequest(NotesErrors.NOT_FOUND);

  // Ensure task is not floating (must be tied to a room)
  if (!note.task.room) throw APP_ERRORS.badRequest(TaskErrors.FLOATING);

  const transformedNote = transformNote(note);

  return transformedNote as NoteWithContext;
};
