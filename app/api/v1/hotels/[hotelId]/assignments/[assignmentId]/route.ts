import { getAssignmentAccessContext, prisma } from '@lib/db';
import { canDeleteAssignment } from '@lib/server';
import {
  APP_ERRORS,
  assignmentUpdateSchema,
  GeneralErrors,
  HttpStatus,
  validateStatusTransition,
  withErrorHandling,
} from '@lib/shared';
import { type Assignment, AssignmentStatus } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { AssignmentParams, AssignmentUpdateBody } from '@/types';
//TODO this needs a rework

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
    const { assignmentId, isAdmin, isAssignmentCleaner, isHotelManager } =
      await getAssignmentAccessContext({ params, req });

    const data = assignmentUpdateSchema.parse(await req.json());
    let updateData: Partial<AssignmentUpdateBody> = {};

    if (isAdmin) {
      updateData = data;
    } else if (isHotelManager) {
      // Managers can only update specific fields
      const allowedFields: (keyof AssignmentUpdateBody)[] = ['priority'];

      for (const key of allowedFields) {
        if (key in data && data[key] !== undefined) {
          updateData[key] = data[key] as any;
        }
      }

      // Prevent status changes
      if ('status' in data) {
        throw APP_ERRORS.forbidden('Managers cannot change assignment status');
      }
    } else if (isAssignmentCleaner) {
      if (!('status' in data) || data.status === undefined)
        throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);
      updateData = { status: data.status };
    } else {
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    }

    if ('status' in updateData && updateData.status) {
      const currentAssignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: { status: true },
      });

      if (currentAssignment) {
        validateStatusTransition(currentAssignment.status, updateData.status);
      }

      // Auto-set timestamps based on status
      if (
        updateData.status === AssignmentStatus.IN_PROGRESS &&
        !updateData.startedAt
      ) {
        updateData.startedAt = new Date();
      }
      if (
        updateData.status === AssignmentStatus.COMPLETED &&
        !updateData.completedAt
      ) {
        updateData.completedAt = new Date();
      }
      if (
        updateData.status === AssignmentStatus.CANCELLED &&
        !updateData.cancelledAt
      ) {
        updateData.cancelledAt = new Date();
      }
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
    const { assignmentId, roles } = await getAssignmentAccessContext({
      params,
      req,
    });

    if (!canDeleteAssignment({ roles })) throw APP_ERRORS.forbidden();

    await prisma.assignment.delete({ where: { id: assignmentId } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
