import {
  APP_ERRORS,
  canCreateAssignment,
  GeneralErrors,
  getHotelOrThrow,
  getUserOrThrow,
  hasManagerPermission,
  HttpStatus,
  isHotelCleaner,
  withErrorHandling,
} from '@lib';
import { prisma } from '@lib/prisma';
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

    let where;

    if (hasManagerPermission({ hotelId, roles })) {
      where = { room: { hotelId } };
    } else if (isHotelCleaner({ hotelId, roles })) {
      where = { assignedUsers: { some: { userId } } };
    } else {
      throw APP_ERRORS.forbidden();
    }

    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: { dueAt: 'asc' },
      include: {
        room: true,
        notes: { omit: { assignmentId: true } },
        assignedBy: { omit: { passwordHash: true } },
        assignedUsers: {
          include: { user: { omit: { passwordHash: true } } },
          omit: { userId: true, assignmentId: true },
        },
      },
      omit: {
        assignedById: true,
        roomId: true,
      },
    });
    const assignmentsFlatened = assignments.map(
      ({ assignedUsers, ...assignment }) => {
        // Flatten assignmentUsers and rename to cleaners
        const cleaners = assignedUsers.map(({ assignedAt, user }) => ({
          ...user,
          assignedAt,
        }));
        return { ...assignment, cleaners };
      }
    );
    return NextResponse.json<TAssignmentResponse[]>(assignmentsFlatened);
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
