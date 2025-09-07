import { getHotelOrThrow } from "@/helpers/getHotelOrThrow";
import { GeneralErrors, HttpStatus } from "@constants";
import { canCreateAssignment, canListAssignments, getAuthContext } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";
import type { AssignmentCollectionParams, CreateAssignmentBody } from "types";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getAuthContext(req);

        if (!canListAssignments({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const assignments = await prisma.assignment.findMany({ where: { room: { hotelId } } })

        return NextResponse.json(assignments);
    }
)

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentCollectionParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles, id: userId } = await getAuthContext(req);

        if (!canCreateAssignment({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);

        const data = await req.json() as CreateAssignmentBody;

        const { dueAt, roomId, roomNumber } = data;
        if (!roomNumber || !dueAt || roomId) throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMETERS);

        const newAssignment = await prisma.assignment.create({
            data: { ...data, assignedBy: userId }
        });

        return NextResponse.json(newAssignment, { status: HttpStatus.CREATED });
    }
)
