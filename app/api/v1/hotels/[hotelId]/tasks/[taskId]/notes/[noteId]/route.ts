import {
  getNoteOrThrow,
  getTaskOrThrow,
  getHotelOrThrow,
  getUserOrThrow,
  prisma,
} from '@lib/db';
import { HttpStatus, withErrorHandling } from '@lib/shared';
import type { NextRequest } from 'next/server';

import type { NoteParams } from '@/types';

// To-Do Refactor
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: NoteParams }) => {
    const { hotelId: hotelIdParam, taskId: taskIdParam, noteId } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const { id: taskId } = await getTaskOrThrow(taskIdParam);
    const { id: authorId } = await getUserOrThrow(req);

    const note = await getNoteOrThrow({
      noteId,
      expectedTaskId: taskId,
      expectedHotelId: hotelId,
      expectedAuthorId: authorId,
    });

    await prisma.note.delete({ where: { id: note.id } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
