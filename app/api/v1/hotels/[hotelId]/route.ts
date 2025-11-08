import type { Task } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import {
  canCreateTask,
  hasManagerPermission,
  isHotelCleaner,
} from '@/lib/shared/utils/permissions';
import { transformTask } from '@/lib/shared/utils/transformTask';
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

    if (hasManagerPermission({ hotelId, roles })) {
      baseWhere = { room: { hotelId } };
    } else if (isHotelCleaner({ hotelId, roles })) {
      baseWhere = { assignedUsers: { some: { userId } } };
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
      select: {
        id: true,
        status: true,
        priority: true,
        dueAt: true,
        startedAt: true,
        completedAt: true,
        cancelledAt: true,
        createdAt: true,
        cancellationNote: true,
        deletedAt: true,
        deletedBy: true,
        _count: {
          select: {
            cleaners: true,
            images: true,
            notes: true,
          },
        },

        room: true,

        notes: {
          include: {
            author: {
              select: {
                avatarUrl: true,
                email: true,
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },

        images: {
          include: {
            uploader: {
              select: {
                avatarUrl: true,
                email: true,
                id: true,
                name: true,
              },
            },
          },
          orderBy: { uploadedAt: 'desc' },
        },

        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },

        cleaners: {
          select: {
            assignedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const transformedTask = tasks.map(transformTask);

    return NextResponse.json<TaskResponse[]>(transformedTask);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: TaskCollectionParams }) => {
    const { hotelId: paramsHotelId } = await params;
    const { id: hotelId } = await getHotelOrThrow(paramsHotelId);

    const { roles, id: userId } = await getUserOrThrow(req);

    if (!canCreateTask({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    const validated = taskCreationSchema.parse(await req.json());
    const { roomId, dueAt, cleaners, priority } = validated;
    const newTask = await prisma.task.create({
      data: {
        roomId,
        dueAt,
        assignedById: userId,
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
