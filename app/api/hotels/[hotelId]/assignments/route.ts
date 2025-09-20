import type { AssignmentCollectionParams, AssignmentCreationBody, AssignmentResponse } from "@apptypes";
import { GeneralErrors, HttpStatus } from "@constants";
import { APP_ERRORS, withErrorHandling } from "@errors";
import { canCreateAssignment, canListAssignments, getHotelOrThrow, getUserOrThrow } from "@helpers";
import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canListAssignments({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const assignments = await prisma.assignment.findMany({
            where: { room: { hotelId } },
            orderBy: { dueAt: 'asc' },
            include: {
                room: true,
                assignedByUser: { omit: { passwordHash: true } },
                users: { omit: { passwordHash: true } }
            }
        })

        return NextResponse.json<AssignmentResponse[]>(assignments);
    }
);

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentCollectionParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);
        const { roles, id: userId } = await getUserOrThrow(req);
        if (!canCreateAssignment({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
        const json = await req.json() as AssignmentCreationBody;

        const { roomId, dueAt, cleaners } = json;

        const parsedDueAt = new Date(dueAt);
        if (!parsedDueAt || !roomId) throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);

        const newAssignment = await prisma.assignment.create({
            data: {
                roomId: roomId,
                dueAt: parsedDueAt,
                assignedBy: userId,
                users: { connect: cleaners.map(id => ({ id })) }
            },
            include: {
                room: true,
                assignedByUser: { omit: { passwordHash: true } },
                users: { omit: { passwordHash: true } }
            }
        })

        return NextResponse.json<AssignmentResponse>(newAssignment, { status: HttpStatus.CREATED });
    }
)