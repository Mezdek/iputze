import { getHotelOrThrow, getUserOrThrow, prisma } from '@lib/db';
import {
  canCreateAssignment,
  hasManagerPermission,
  isHotelCleaner,
  transformAssignment,
} from '@lib/server';
import {
  APP_ERRORS,
  assignmentCreationSchema,
  GeneralErrors,
  HttpStatus,
  withErrorHandling,
} from '@lib/shared';
import type { Assignment } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { AssignmentCollectionParams, TAssignmentResponse } from '@/types';

export const GET = withErrorHandling(
  async (
    req: NextRequest,
    { params }: { params: AssignmentCollectionParams }
  ) => {
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

    const assignments = await prisma.assignment.findMany({
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
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            authorId: true,
            deletedAt: true,
          },
        },

        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
            notes: true,
            updatedAt: true,
            deletedAt: true,
          },
        },

        assignedUsers: {
          select: {
            assignedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                notes: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
          },
        },
      },
    });

    const transformedAssignments = assignments.map(transformAssignment);

    return NextResponse.json<TAssignmentResponse[]>(transformedAssignments);
  }
);

export const POST = withErrorHandling(
  async (
    req: NextRequest,
    { params }: { params: AssignmentCollectionParams }
  ) => {
    const { hotelId: paramsHotelId } = await params;
    const { id: hotelId } = await getHotelOrThrow(paramsHotelId);

    const { roles, id: userId } = await getUserOrThrow(req);

    if (!canCreateAssignment({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    const validated = assignmentCreationSchema.parse(await req.json());
    const { roomId, dueAt, cleaners, estimatedMinutes, priority } = validated;
    const newAssignment = await prisma.assignment.create({
      data: {
        roomId,
        dueAt,
        assignedById: userId,
        assignedUsers: {
          create: cleaners.map((cleanerId: string) => ({ userId: cleanerId })),
        },
        estimatedMinutes,
        priority,
      },
    });

    return NextResponse.json<Assignment>(newAssignment, {
      status: HttpStatus.CREATED,
    });
  }
);
