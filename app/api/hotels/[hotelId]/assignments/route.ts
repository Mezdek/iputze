import { getHotelOrThrow } from "@/lib/helpers/getHotelOrThrow";
import { GeneralErrors, HttpStatus } from "@/lib/constants";
import { canCreateAssignment, canListAssignments, getAuthContext, getPaginationFromRequest } from "@/lib/helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { AssignmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { AssignmentCollectionParams, CreateAssignmentBody } from "@/lib/types";


export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getAuthContext(req);

        if (!canListAssignments({ roles, hotelId })) throw APP_ERRORS.forbidden();

        const { page, pageSize, skip, take } = getPaginationFromRequest(req);
        const status = req.nextUrl.searchParams.get('status') as AssignmentStatus | null;
        const isActive = req.nextUrl.searchParams.get('active') !== 'false';

        const where = {
            room: { hotelId },
            ...(status && { status }),
            isActive
        };


        const [assignments, total] = await Promise.all([
            prisma.assignment.findMany({
                where,
                skip,
                take,
                orderBy: { dueAt: 'asc' },
                select: {
                    id: true,
                    roomNumber: true,
                    status: true,
                    dueAt: true,
                    isActive: true,
                    notes: true,
                    room: {
                        select: {
                            id: true,
                            number: true,
                            cleanliness: true
                        }
                    }
                }
            }),
            prisma.assignment.count({ where })
        ]);

        return NextResponse.json({
            assignments,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    }
);

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentCollectionParams }) => {
        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles, id: userId } = await getAuthContext(req);

        if (!canCreateAssignment({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);

        const data = await req.json() as CreateAssignmentBody;

        const { dueAt, roomId, roomNumber } = data;
        if (!roomNumber || !dueAt || !roomId) throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMETERS);

        const newAssignment = await prisma.assignment.create({
            data: { ...data, assignedBy: userId }
        });

        return NextResponse.json(newAssignment, { status: HttpStatus.CREATED });
    }
)
