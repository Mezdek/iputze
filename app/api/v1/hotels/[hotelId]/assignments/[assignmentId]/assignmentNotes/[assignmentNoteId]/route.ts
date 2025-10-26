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
    const {
      hotelId: hotelIdParam,
      assignmentId: assignmentIdParam,
      assignmentNoteId,
    } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const { id: assignmentId } = await getAssignmentOrThrow(assignmentIdParam);
    const { id: authorId } = await getUserOrThrow(req);

    const assignmentNote = await getAssignmentNoteOrThrow({
      assignmentNoteId,
      expectedAssignmentId: assignmentId,
      expectedHotelId: hotelId,
      expectedAuthorId: authorId,
    });

    await prisma.assignmentNote.delete({ where: { id: assignmentNote.id } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
