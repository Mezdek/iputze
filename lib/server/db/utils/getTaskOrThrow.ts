import { prisma } from '@/lib/server/db/prisma';
import { taskSelect } from '@/lib/shared/constants';
import { TaskErrors } from '@/lib/shared/constants/errors/tasks';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { transformTask } from '@/lib/shared/utils/transformers/transformTask';
import type { TaskResponse } from '@/types';

/**
 * Retrieves an task by ID and throws if not found or invalid.
 *
 * @param taskIdParam - Raw taskId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If taskId is invalid or task not found.
 */
export const getTaskOrThrow = async (taskId: string): Promise<TaskResponse> => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect,
  });

  if (!task) throw APP_ERRORS.badRequest(TaskErrors.NOT_FOUND);

  const transformedTask = transformTask(task);

  return transformedTask;
};
