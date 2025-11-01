import { type Task, TaskPriority } from '@prisma/client';

import type { TaskResponse } from '@/types';

export function hasHighPriorityTask(task: Task | TaskResponse) {
  return task.priority === TaskPriority.HIGH;
}
