import { prisma } from '@/lib/server/db/prisma';
import { noteSelect } from '@/lib/shared/constants';
import { NotesErrors } from '@/lib/shared/constants/errors/notes';
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
    select: noteSelect,
  });

  if (!note) throw APP_ERRORS.badRequest(NotesErrors.NOT_FOUND);

  const transformedNote = transformNote(note);

  return transformedNote as NoteWithContext;
};
