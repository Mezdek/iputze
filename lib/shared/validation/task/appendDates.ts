import type { TaskUpdateBody } from '@/types';

export function appendDates(data: TaskUpdateBody): typeof data & {
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
} {
  const obj: {
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  } = {};

  if (data.status === 'IN_PROGRESS') {
    obj.startedAt = new Date();
  }
  if (data.status === 'COMPLETED') {
    obj.completedAt = new Date();
  }
  if (data.cancellationNote) {
    obj.cancelledAt = new Date();
  }

  return { ...data, ...obj };
}
