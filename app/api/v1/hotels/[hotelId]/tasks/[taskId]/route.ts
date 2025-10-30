import { getTaskAccessContext, prisma } from '@lib/db';
import { canDeleteTask } from '@lib/server';
import {
  APP_ERRORS,
  GeneralErrors,
  HttpStatus,
  taskUpdateSchema,
  validateStatusTransition,
  withErrorHandling,
} from '@lib/shared';
import { type Task, TaskStatus } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { TaskParams, TaskUpdateBody } from '@/types';
//TODO this needs a rework

/**
 * GET /api/hotels/[hotelId]/tasks/[taskId]
 * Returns the full task (after validating access).
 */
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskParams }) => {
    const { task } = await getTaskAccessContext({ params, req });
    return NextResponse.json<Task>(task);
  }
);

/**
 * PATCH /api/hotels/[hotelId]/tasks/[taskId]
 * Updates an task depending on the user's role:
 * - Admin: can update all fields.
 * - Hotel Manager: can update `notes` and `isActive` only.
 * - Task Cleaner: can update `status` only.
 */
export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskParams }) => {
    const { taskId, isAdmin, isTaskCleaner, isHotelManager } =
      await getTaskAccessContext({ params, req });

    const data = taskUpdateSchema.parse(await req.json());
    let updateData: Partial<TaskUpdateBody> = {};

    if (isAdmin) {
      updateData = data;
    } else if (isHotelManager) {
      // Managers can only update specific fields
      const allowedFields: (keyof TaskUpdateBody)[] = ['priority'];

      for (const key of allowedFields) {
        if (key in data && data[key] !== undefined) {
          updateData[key] = data[key] as any;
        }
      }

      // Prevent status changes
      if ('status' in data) {
        throw APP_ERRORS.forbidden('Managers cannot change task status');
      }
    } else if (isTaskCleaner) {
      if (!('status' in data) || data.status === undefined)
        throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);
      updateData = { status: data.status };
    } else {
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    }

    if ('status' in updateData && updateData.status) {
      const currentTask = await prisma.task.findUnique({
        where: { id: taskId },
        select: { status: true },
      });

      if (currentTask) {
        validateStatusTransition(currentTask.status, updateData.status);
      }

      // Auto-set timestamps based on status
      if (
        updateData.status === TaskStatus.IN_PROGRESS &&
        !updateData.startedAt
      ) {
        updateData.startedAt = new Date();
      }
      if (
        updateData.status === TaskStatus.COMPLETED &&
        !updateData.completedAt
      ) {
        updateData.completedAt = new Date();
      }
      if (
        updateData.status === TaskStatus.CANCELLED &&
        !updateData.cancelledAt
      ) {
        updateData.cancelledAt = new Date();
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json<Task>(updatedTask);
  }
);

/**
 * DELETE /api/hotels/[hotelId]/tasks/[taskId]
 * Only users with sufficient authority (`canDeleteTask`) may delete.
 */
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskParams }) => {
    const { taskId, roles } = await getTaskAccessContext({
      params,
      req,
    });

    if (!canDeleteTask({ roles })) throw APP_ERRORS.forbidden();

    await prisma.task.delete({ where: { id: taskId } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
