import {
  APP_ERRORS,
  AssignmentErrors,
  GeneralErrors,
  getAssignmentOrThrow,
  getHotelOrThrow,
  getUserOrThrow,
  isAdmin as isAdminCheck,
  isHotelManager as isHotelManagerCheck,
} from '@lib';
import { prisma } from '@lib/prisma';
import type { NextRequest } from 'next/server';

import type {
  AssignmentAccessContext,
  AssignmentNoteCollectionParams,
} from '@/types';

export const getAssignmentAccessContext = async ({
  params,
  req,
}: {
  params: AssignmentNoteCollectionParams;
  req: NextRequest;
}): Promise<AssignmentAccessContext> => {
  const hotel = await getHotelOrThrow(params.hotelId);
  const { id: hotelId } = hotel;
  const assignment = await getAssignmentOrThrow(params.assignmentId);
  const { id: assignmentId } = assignment;

  if (assignment.room.hotelId !== hotelId)
    throw APP_ERRORS.badRequest(AssignmentErrors.NOT_IN_HOTEL);

  const { roles, id: userId } = await getUserOrThrow(req);

  const isAdmin = isAdminCheck({ roles });
  const isHotelManager = isHotelManagerCheck({ roles, hotelId });
  let isAssignmentCleaner = false;

  const returnable = {
    hotelId,
    assignmentId,
    userId,
    assignment,
    roles,
    isAdmin,
    isHotelManager,
    isAssignmentCleaner,
  };

  if (isAdmin || isHotelManager) return returnable;

  const assignmentUser = await prisma.assignmentUser.findUnique({
    where: { assignmentId_userId: { assignmentId, userId } },
  });

  if (!assignmentUser) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

  return { ...returnable, isAssignmentCleaner: !!assignmentUser };
};
