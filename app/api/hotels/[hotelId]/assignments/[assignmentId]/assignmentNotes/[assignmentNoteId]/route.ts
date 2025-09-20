import type { AssignmentNoteParams, AssignmentNoteUpdateBody } from "@apptypes";
import { HttpStatus } from "@constants";
import { withErrorHandling } from "@errors";
import { getAssignmentNoteOrThrow, getAssignmentOrThrow, getHotelOrThrow, getUserOrThrow } from "@helpers";
import { prisma } from "@lib/prisma";
import { AssignmentNote } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


// To-Do Refactor
export const DELETE = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentNoteParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const { id: assignmentId } = await getAssignmentOrThrow(params.assignmentId);
        const { id: authorId } = await getUserOrThrow(req);
        const assignmentNote = await getAssignmentNoteOrThrow(
            {
                assignmentNoteId: params.assignmentNoteId,
                expectedAssignmentId: assignmentId,
                expectedHotelId: hotelId,
                expectedAuthorId: authorId
            }
        );

        await prisma.assignmentNote.delete({ where: { id: assignmentNote.id } });

        return NextResponse.json(null, { status: HttpStatus.NO_CONTENT });
    }
);

