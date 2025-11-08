import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getTaskOrThrow } from '@/lib/server/db/utils/getTaskOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { TaskErrors } from '@/lib/shared/constants/errors/tasks';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
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

  const cleaners = await prisma.cleaner.findMany({
    where: { taskId },
  });

  return { hotelId, taskId, userId, task, roles, cleaners };
};
