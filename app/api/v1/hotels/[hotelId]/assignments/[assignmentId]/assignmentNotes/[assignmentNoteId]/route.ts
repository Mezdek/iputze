import {
  getAssignmentNoteOrThrow,
  getAssignmentOrThrow,
  getHotelOrThrow,
  getUserOrThrow,
  prisma,
} from '@lib/db';
import { HttpStatus, withErrorHandling } from '@lib/shared';
import type { NextRequest } from 'next/server';

import type { AssignmentNoteParams } from '@/types';

// To-Do Refactor
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: AssignmentNoteParams }) => {
    const { id: hotelId } = await getHotelOrThrow(params.hotelId);
    const { id: assignmentId } = await getAssignmentOrThrow(
      params.assignmentId
    );
    const { id: authorId } = await getUserOrThrow(req);
    const assignmentNote = await getAssignmentNoteOrThrow({
      assignmentNoteId: params.assignmentNoteId,
      expectedAssignmentId: assignmentId,
      expectedHotelId: hotelId,
      expectedAuthorId: authorId,
    });

    await prisma.assignmentNote.delete({ where: { id: assignmentNote.id } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
