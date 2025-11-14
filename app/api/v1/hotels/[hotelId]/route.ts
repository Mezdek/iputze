import type { Task } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import { RATE_LIMIT_KEYS, taskSelect } from '@/lib/shared/constants';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission, checkRoles } from '@/lib/shared/utils/permissions';
import { transformTask } from '@/lib/shared/utils/transformers/transformTask';
import { taskCreationSchema } from '@/lib/shared/validation/schemas';
import type { TaskCollectionParams, TaskResponse } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskCollectionParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

    const { hotelId: hotelIdParam } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);

    const { roles, id: userId } = await getUserOrThrow(req);
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let baseWhere;

    const isRanged =
      !!startDate &&
      !!endDate &&
      !isNaN(new Date(startDate).getTime()) &&
      !isNaN(new Date(endDate).getTime()) &&
      new Date(endDate) < new Date(startDate);

    if (checkRoles.hasManagerPermission({ hotelId, roles })) {
      baseWhere = { room: { hotelId }, deletedAt: null };
    } else if (checkRoles.isHotelCleaner({ hotelId, roles })) {
      baseWhere = { cleaners: { some: { userId }, deletedAt: null } };
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
      orderBy: { dueAt: 'asc' },
      select: taskSelect,
    });

    const transformedTask = tasks.map(transformTask);

    return NextResponse.json<TaskResponse[]>(transformedTask);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskCollectionParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');
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
          create: cleaners.map((cleanerId: string) => ({ userId: cleanerId })),
        },
        priority,
      },
    });

    return NextResponse.json<Task>(newTask, {
      status: HttpStatus.CREATED,
    });
  }
);
