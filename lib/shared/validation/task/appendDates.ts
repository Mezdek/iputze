import { type Task, TaskStatus } from '@prisma/client';

import type { TaskUpdateBody } from '@/types';

export function appendDates(
  data: TaskUpdateBody,
  userId: string
): Partial<Task> {
  if (data.status === TaskStatus.IN_PROGRESS) {
    const startedAt = new Date();
    return { ...data, startedAt };
  }
  if (data.status === TaskStatus.COMPLETED) {
    const completedAt = new Date();
    return { ...data, completedAt };
  }
  if (data.cancelationNote) {
    const canceledAt = new Date();
    return {
      ...data,
      status: TaskStatus.CANCELED,
      canceledAt,
      cancelerId: userId,
    };
  }
  return data;
}
