import { prisma } from '@lib/db';
import { APP_ERRORS, TaskErrors } from '@lib/shared';

/**
 * Retrieves an task by ID and throws if not found or invalid.
 *
 * @param taskIdParam - Raw taskId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If taskId is invalid or task not found.
 */
export const getTaskOrThrow = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      room: {
        select: {
          hotelId: true,
        },
      },
      assignedBy: {
        omit: {
          passwordHash: true,
        },
      },
    },
  });

  if (!task) throw APP_ERRORS.badRequest(TaskErrors.NOT_FOUND);

  return task;
};
