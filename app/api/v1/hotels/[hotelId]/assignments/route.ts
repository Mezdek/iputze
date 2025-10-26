import { getHotelOrThrow, getUserOrThrow, prisma } from '@lib/db';
import {
  canCreateAssignment,
  hasManagerPermission,
  isHotelCleaner,
  transformAssignment,
} from '@lib/server';
import {
  APP_ERRORS,
  GeneralErrors,
  HttpStatus,
  withErrorHandling,
} from '@lib/shared';
import type { Assignment } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type {
  AssignmentCollectionParams,
  AssignmentCreationBody,
  TAssignmentResponse,
} from '@/types';

export const GET = withErrorHandling(
  async (
    req: NextRequest,
    { params }: { params: AssignmentCollectionParams }
  ) => {
    const { id: hotelId } = await getHotelOrThrow(params.hotelId);
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
      include: {
        room: true,
        notes: true,
        assignedBy: { omit: { passwordHash: true } },
        assignedUsers: {
          include: { user: { omit: { passwordHash: true } } },
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

    const json = (await req.json()) as AssignmentCreationBody;
    const { roomId, dueAt, cleaners } = json;
    const parsedDueAt = new Date(dueAt);
    if (!parsedDueAt || !roomId)
      throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);

    const newAssignment = await prisma.assignment.create({
      data: {
        roomId,
        dueAt: parsedDueAt,
        assignedById: userId,
        assignedUsers: {
          create: cleaners.map((userId) => ({ userId })),
        },
      },
    });

    return NextResponse.json<Assignment>(newAssignment, {
      status: HttpStatus.CREATED,
    });
  }
);
