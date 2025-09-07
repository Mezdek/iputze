import { AssignmentParams, UpdateAssignmentBody } from "@/types";
import { CustomSuccessMessages, GeneralErrors, HttpStatus } from "@constants";
import {
    canDeleteAssignment,
    getAssignmentAccessContext
} from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/hotels/[hotelId]/assignments/[assignmentId]
 * Returns the full assignment (after validating access).
 */
export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: AssignmentParams }) => {
        const { assignment } = await getAssignmentAccessContext({ params, req });
        return NextResponse.json(assignment);
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
        const { assignmentId, isAdmin, isAssignmentCleaner, isHotelManager } =
            await getAssignmentAccessContext({ params, req });

        const data = (await req.json()) as UpdateAssignmentBody;
        let updateData: Partial<UpdateAssignmentBody> = {};

        if (isAdmin) {
            updateData = data;
        } else if (isHotelManager) {
            if ("status" in data && data.status !== undefined) {
                throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);
            }
            updateData = {
                notes: data.notes,
                isActive: data.isActive,
            };
        } else if (isAssignmentCleaner) {
            if (!("status" in data) || data.status === undefined) {
                throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMETERS);
            }
            updateData = { status: data.status };
        } else {
            throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: assignmentId },
            data: updateData,
        });

        return NextResponse.json(updatedAssignment);
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

        return NextResponse.json({ message: CustomSuccessMessages.ASSIGNMENT_DELETED_SUCCESSFULLY }, { status: HttpStatus.NO_CONTENT });
    }
);
