
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
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import type {
  AssignmentCollectionParams,
  AssignmentCreationBody,
  AssignmentResponse,
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
      where = { AssignmentUser: { some: { userId } } };
    } else {
      throw APP_ERRORS.forbidden();
    }

    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: { dueAt: 'asc' },
      include: {
        room: true,
        AssignmentNote: true,
        assignedByUser: { omit: { passwordHash: true } },
        AssignmentUser: { include: { user: { omit: { passwordHash: true } } } },
      },
    });
    const assignmentsFlatened = assignments.map(a => {
      const cleaners = a.AssignmentUser.map(a => a.user);
      return { ...a, cleaners };
    });
    return NextResponse.json<AssignmentResponse[]>(assignmentsFlatened);
  }
);

export const POST = withErrorHandling(
  async (
    req: NextRequest,
    { params }: { params: AssignmentCollectionParams }
  ) => {
    const { id: hotelId } = await getHotelOrThrow(params.hotelId);
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
        assignedBy: userId,
        AssignmentUser: {
          create: cleaners.map(id => ({ userId: id })),
        },
      },
    });

    return NextResponse.json<Assignment>(newAssignment, {
      status: HttpStatus.CREATED,
    });
  }
);
