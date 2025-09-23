import type { AssignmentParams, AssignmentUpdateBody } from "@/types";
import { APP_ERRORS, canDeleteAssignment, GeneralErrors, getAssignmentAccessContext, HttpStatus, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import { Assignment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/hotels/[hotelId]/assignments/[assignmentId]
 * Returns the full assignment (after validating access).
 */
export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentParams }) => {
        const { assignment } = await getAssignmentAccessContext({ params, req });
        return NextResponse.json<Assignment>(assignment);
    }
);

/**
 * PATCH /api/hotels/[hotelId]/assignments/[assignmentId]
 * Updates an assignment depending on the user's role:
 * - Admin: can update all fields.
 * - Hotel Manager: can update `notes` and `isActive` only.
 * - Assignment Cleaner: can update `status` only.
 */
export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentParams }) => {
        const { assignmentId, isAdmin, isAssignmentCleaner, isHotelManager, assignment: { isActive } } =
            await getAssignmentAccessContext({ params, req });

        const data = (await req.json()) as AssignmentUpdateBody;
        let updateData: Partial<AssignmentUpdateBody> = {};

        if (isAdmin) {
            updateData = data;
        } else if (isHotelManager) {
            if ("status" in data && data.status !== undefined) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
            updateData = { isActive: data.isActive };
        } else if (isAssignmentCleaner) {
            if (!("status" in data) || data.status === undefined) throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS)
            if (!isActive) throw APP_ERRORS.badRequest(GeneralErrors.ACTION_DENIED)
            updateData = { status: data.status };
        } else {
            throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: assignmentId },
            data: updateData,
        });

        return NextResponse.json<Assignment>(updatedAssignment);
    }
);

/**
 * DELETE /api/hotels/[hotelId]/assignments/[assignmentId]
 * Only users with sufficient authority (`canDeleteAssignment`) may delete.
 */
export const DELETE = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentParams }) => {

        const { assignmentId, roles } = await getAssignmentAccessContext({ params, req });

        if (!canDeleteAssignment({ roles })) throw APP_ERRORS.forbidden();

        await prisma.assignment.delete({ where: { id: assignmentId } });

        return new Response(null, { status: HttpStatus.NO_CONTENT });
    }
);
