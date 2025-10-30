import { getHotelOrThrow, getUserOrThrow, prisma } from '@lib/db';
import {
  canCreateTask,
  hasManagerPermission,
  isHotelCleaner,
  transformTask,
} from '@lib/server';
import {
  APP_ERRORS,
  GeneralErrors,
  HttpStatus,
  taskCreationSchema,
  withErrorHandling,
} from '@lib/shared';
import type { Task } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
          dueAt: {
            ...baseWhere,
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
        estimatedMinutes: true,
        actualMinutes: true,
        createdAt: true,
        cancellationNote: true,
        room: true,
        notes: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },

        images: {
          include: {
            uploader: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
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

    const transformedTasks = tasks.map(transformTask);

    return NextResponse.json<TaskResponse[]>(transformedTasks);
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
    const { roomId, dueAt, cleaners, estimatedMinutes, priority } = validated;
    const newTask = await prisma.task.create({
      data: {
        roomId,
        dueAt,
        assignedById: userId,
        cleaners: {
          create: cleaners.map((userId) => ({ userId })),
        },
        estimatedMinutes,
        priority,
      },
    });

    return NextResponse.json<Task>(newTask, {
      status: HttpStatus.CREATED,
    });
  }
);
