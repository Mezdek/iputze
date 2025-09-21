import type { AssignmentNoteCollectionParams, AssignmentNoteCreationBody } from "@apptypes";
import { getAssignmentAccessContext, HttpStatus, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import { AssignmentNote } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentNoteCollectionParams }) => {
     
        const { assignmentId } = await getAssignmentAccessContext({ params, req });

        const assignmentNotes = await prisma.assignmentNote.findMany(
            {
                where: { assignmentId },
                orderBy: { updatedAt: "desc" },
            })

        return NextResponse.json<AssignmentNote[]>(assignmentNotes);
    },
);


export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentNoteCollectionParams }) => {
        const { assignmentId, userId } = await getAssignmentAccessContext({ params, req });

        const data = (await req.json()) as AssignmentNoteCreationBody;

        // Create the new note
        const assignmentNote = await prisma.assignmentNote.create({
            data: {
                content: data.content,
                assignmentId,
                authorId: userId,
            },
        });
        return NextResponse.json<AssignmentNote>(assignmentNote, { status: HttpStatus.CREATED });
    },
);