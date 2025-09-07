import { HttpStatus } from "@/constants";
import type { AssignmentNoteCollectionParams, CreateAssignmentNoteBody } from "@/types";
import { getAssignmentAccessContext, getPaginationFromRequest } from "@helpers";
import { prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentNoteCollectionParams }) => {
        const { assignmentId } = await getAssignmentAccessContext({ params, req });

        // Parse pagination query params
        const { page, pageSize, skip, take } = getPaginationFromRequest(req);

        // Fetch paginated notes
        const [assignmentNotes, total] = await Promise.all([
            prisma.assignmentNote.findMany({
                where: { assignmentId },
                skip,
                take,
                orderBy: { updatedAt: "desc" },
            }),
            prisma.assignmentNote.count({ where: { assignmentId } }),
        ]);

        return NextResponse.json({
            notes: assignmentNotes,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        });
    },
);


export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentNoteCollectionParams }) => {
        const { assignmentId, userId } = await getAssignmentAccessContext({ params, req });

        const data = (await req.json()) as CreateAssignmentNoteBody;

        // Create the new note
        const newNote = await prisma.assignmentNote.create({
            data: {
                content: data.content,
                assignmentId,
                authorId: userId,
            },
        });

        // Apply pagination
        const { page, pageSize, skip, take } = getPaginationFromRequest(req);

        // Fetch paginated notes including the new one
        const [assignmentNotes, total] = await Promise.all([
            prisma.assignmentNote.findMany({
                where: { assignmentId },
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            prisma.assignmentNote.count({ where: { assignmentId } }),
        ]);

        return NextResponse.json(
            {
                newNote,
                notes: assignmentNotes,
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
            { status: HttpStatus.CREATED },
        );
    },
);