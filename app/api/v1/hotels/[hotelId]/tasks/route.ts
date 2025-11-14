import type { Task } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { GeneralErrors, HttpStatus, taskSelect } from '@/lib/shared/constants';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission, checkRoles } from '@/lib/shared/utils/permissions';
import { transformTask } from '@/lib/shared/utils/transformers/transformTask';
import { taskCreationSchema } from '@/lib/shared/validation/schemas';
import type { TaskCollectionParams, TaskResponse } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskCollectionParams }) => {
    const { hotelId: hotelIdParam } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);

    const { roles, id: userId } = await getUserOrThrow(req);
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let baseWhere;
    const isRanged = !!startDate && !!endDate;

    if (checkRoles.hasManagerPermission({ hotelId, roles })) {
      baseWhere = { room: { hotelId } };
    } else if (checkRoles.isHotelCleaner({ hotelId, roles })) {
      baseWhere = { cleaners: { some: { userId } } };
    } else {
      throw APP_ERRORS.forbidden();
    }
    const where = isRanged
      ? {
          ...baseWhere,
          dueAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : baseWhere;
    const tasks = await prisma.task.findMany({
      where,
      select: taskSelect,
      orderBy: { dueAt: 'asc' },
    });

    const transformedTasks = tasks.map(transformTask);

    return NextResponse.json<TaskResponse[]>(transformedTasks);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskCollectionParams }) => {
    const { hotelId: paramsHotelId } = await params;
    const { id: hotelId } = await getHotelOrThrow(paramsHotelId);

    const { roles, id: userId } = await getUserOrThrow(req);

    if (!checkPermission.creation.task({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    const validated = taskCreationSchema.parse(await req.json());
    const { roomId, dueAt, cleaners, priority } = validated;
    const newTask = await prisma.task.create({
      data: {
        roomId,
        dueAt,
        creatorId: userId,
        cleaners: {
          create: cleaners.map((userId) => ({ userId })),
        },
        priority,
      },
    });

    return NextResponse.json<Task>(newTask, {
      status: HttpStatus.CREATED,
    });
  }
);
