import { getAssignmentNoteOrThrow, getAssignmentOrThrow, getHotelOrThrow, getUserOrThrow } from "@helpers";
import { prisma, withErrorHandling } from "@lib";
import type { AssignmentNoteParams, UpdateAssignmentNoteBody } from "@lib/types";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentNoteParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const { id: assignmentId } = await getAssignmentOrThrow(params.assignmentId);
        const { id: authorId } = await getUserOrThrow(req);

        const assignmentNote = await getAssignmentNoteOrThrow({ assignmentNoteIdParam: params.assignmentNoteId, expectedAssignmentId: assignmentId, expectedHotelId: hotelId, expectedAuthorId: authorId });

        const data = (await req.json()) as UpdateAssignmentNoteBody;

        const updatedAssignmentNote = await prisma.assignmentNote.update({
            where: { id: assignmentNote.id },
            data: {
                content: data.content,
            },
        });

        return NextResponse.json(updatedAssignmentNote);
    }
);
