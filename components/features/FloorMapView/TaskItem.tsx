'use client';

import {
  Card,
  CardBody,
  CardHeader,
  type CardProps,
  Chip,
  Divider,
} from '@heroui/react';
import { capitalize, TASK_STATUS_COLORS } from '@lib/shared';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import type { TaskResponse } from '@/types';

interface TaskItemProps extends Omit<CardProps, 'onClick'> {
  task: TaskResponse;
  onClick?: (task: TaskResponse) => void;
}

export function TaskItem({ task, onClick, ...cardProps }: TaskItemProps) {
  const t = useTranslations('task');
  const {
    id,
    status,
    dueAt,
    priority,
    cleaners,
    estimatedMinutes,
    actualMinutes,
    notes,
    images,
  } = task;

  const isOverdue = new Date(dueAt) < new Date() && status !== 'COMPLETED';
  const isPressable = !!onClick;

  return (
    <Card
      className={`
        ${isPressable ? 'hover:scale-[1.01] transition-transform cursor-pointer' : ''}
        ${isOverdue ? 'border-2 border-danger' : ''}
      `}
      isPressable={isPressable}
      onPress={onClick ? () => onClick(task) : undefined}
      {...cardProps}
    >
      <CardHeader className="flex justify-between items-start gap-2 pb-2">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold">
              {t('header', { number: task.room.number })}
            </h3>
            {priority !== 'LOW' && (
              <Chip color="warning" size="sm" variant="flat">
                Priority: {priority}
              </Chip>
            )}
            {isOverdue && (
              <Chip color="danger" size="sm" variant="flat">
                Overdue
              </Chip>
            )}
          </div>
          <Chip color={TASK_STATUS_COLORS[status]} size="sm" variant="flat">
            {capitalize(status, '_', 'ALL_WORDS')}
          </Chip>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="gap-3 pt-3">
        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-default-600">Due:</span>
          <span className={`font-medium ${isOverdue ? 'text-danger' : ''}`}>
            {format(new Date(dueAt), 'MMM dd, yyyy - HH:mm')}
          </span>
        </div>

        {/* Cleaners */}
        {cleaners.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-default-600">Cleaners:</span>
            {cleaners.map(({ id, name }) => (
              <span key={id}>{name} </span>
            ))}
          </div>
        )}

        {/* Time Estimates */}
        {(estimatedMinutes || actualMinutes) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-default-600">Time:</span>
            <span className="font-medium">
              {actualMinutes
                ? `${actualMinutes} min (actual)`
                : estimatedMinutes
                  ? `${estimatedMinutes} min (est.)`
                  : 'N/A'}
            </span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex gap-4 text-xs text-default-500">
          <span>📝 {notes.length} notes</span>
          <span>📷 {images.length} images</span>
        </div>
      </CardBody>
    </Card>
  );
}
