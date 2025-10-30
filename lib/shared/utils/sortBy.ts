import { type Task } from '@prisma/client';

import type { TaskResponse } from '@/types';

export function sortBy<T extends object, K extends keyof T>(
  a: T,
  b: T,
  ref: { key: K; index: T[K][] }
): number {
  const orderOfA = a[ref.key];
  const orderOfB = b[ref.key];

  const indexA = ref.index.indexOf(orderOfA);
  const indexB = ref.index.indexOf(orderOfB);

  if (indexA === -1 && indexB === -1) return 0;
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
}

export function sortByPriority<T extends Task | TaskResponse>(
  taskA: T,
  taskB: T
) {
  return sortBy<T, 'priority'>(taskA, taskB, {
    key: 'priority',
    index: ['HIGH', 'MEDIUM', 'LOW'],
  });
}
