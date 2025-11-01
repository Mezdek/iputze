import {
  getHotelOrThrow,
  getTaskOrThrow,
  getUserOrThrow,
  prisma,
} from '@lib/db';
import {
  isAdmin as isAdminCheck,
  isHotelManager as isHotelManagerCheck,
} from '@lib/server';
import { APP_ERRORS, GeneralErrors, TaskErrors } from '@lib/shared';
import type { NextRequest } from 'next/server';

import type { NoteCollectionParams, TaskAccessContext } from '@/types';

export const getTaskAccessContext = async ({
  params,
  req,
}: {
  params: NoteCollectionParams;
  req: NextRequest;
}): Promise<TaskAccessContext> => {
  const { taskId: taskIdParam, hotelId: hotelIdParam } = await params;
  const hotel = await getHotelOrThrow(hotelIdParam);
  const { id: hotelId } = hotel;
  const task = await getTaskOrThrow(taskIdParam);
  const { id: taskId } = task;

  if (task.room.hotelId !== hotelId)
    throw APP_ERRORS.badRequest(TaskErrors.NOT_IN_HOTEL);

  const { roles, id: userId } = await getUserOrThrow(req);

  const isAdmin = isAdminCheck({ roles });
  const isHotelManager = isHotelManagerCheck({ roles, hotelId });
  let isTaskCleaner = false;

  const returnable = {
    hotelId,
    taskId,
    userId,
    task,
    roles,
    isAdmin,
    isHotelManager,
    isTaskCleaner,
  };

  if (isAdmin || isHotelManager) return returnable;

  const cleaner = await prisma.cleaner.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });

  if (!cleaner) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

  return { ...returnable, isTaskCleaner: !!cleaner };
};
