import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getNoteOrThrow } from '@/lib/server/db/utils/getNoteOrThrow';
import { getTaskOrThrow } from '@/lib/server/db/utils/getTaskOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import type { NoteParams } from '@/types';

// @TODO Refactor
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
