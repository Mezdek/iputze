import type { Task } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getTaskAccessContext } from '@/lib/server/db/utils/getTaskAccessContext';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import { RATE_LIMIT_KEYS } from '@/lib/shared/constants';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import { taskUpdateSchema } from '@/lib/shared/validation/schemas';
import { appendDates } from '@/lib/shared/validation/task/appendDates';
import type { TaskParams, TaskResponse } from '@/types';

/**
 * GET /api/hotels/[hotelId]/tasks/[taskId]
 * Returns the full task (after validating access).
 */
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');
    const { task } = await getTaskAccessContext({ params, req });
    return NextResponse.json<TaskResponse>(task);
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
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

    const { taskId, roles, hotelId, task, userId } = await getTaskAccessContext(
      {
        params,
        req,
      }
    );

    const data = taskUpdateSchema.parse(await req.json());

    if (
      !checkPermission.modification.task({
        roles,
        cleaners: task.cleaners,
        hotelId,
        updateData: data,
      })
    ) {
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    }

    const updateData = appendDates(data, userId);

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
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

    const { taskId, roles, hotelId } = await getTaskAccessContext({
      params,
      req,
    });

    if (!checkPermission.deletion.task({ roles, hotelId }))
      throw APP_ERRORS.forbidden();

    await prisma.task.delete({ where: { id: taskId } });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
