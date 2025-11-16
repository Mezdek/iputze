'use client';

import {
  Card,
  CardBody,
  CardHeader,
  type CardProps,
  Chip,
  cn,
  Divider,
} from '@heroui/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { TaskDetail } from '@/components/features/FloorMapView/TaskDetail';
import { OverdueChip } from '@/components/shared';
import { TASK_STATUS_COLORS } from '@/lib/shared/constants/features/room';
import { capitalize } from '@/lib/shared/utils/capitalize';
import type { MeResponse, TaskResponse } from '@/types';

interface TaskItemProps extends Omit<CardProps, 'onClick'> {
  task: TaskResponse;
  user: MeResponse;
}

export function TaskItem({ task, user, ...cardProps }: TaskItemProps) {
  const t = useTranslations('task');
  const { status, dueAt, priority, cleaners, notes, images } = task;

  const isOverdue = new Date(dueAt) < new Date() && status !== 'COMPLETED';

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Card
      isPressable
      className={cn(
        'hover:scale-[1.01] transition-transform cursor-pointer w-full',
        isOverdue && 'border-2 border-danger'
      )}
      onPress={() => setIsOpen((isOpen) => !isOpen)}
      {...cardProps}
    >
      <CardHeader className="flex justify-between items-start gap-2 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold">
            {t('header', { number: task.room.number })}
          </h3>
          <OverdueChip isOverdue={isOverdue} />
          <Chip color="warning" size="sm" variant="flat">
            {capitalize(priority)}
          </Chip>
          <Chip color={TASK_STATUS_COLORS[status]} size="sm" variant="flat">
            {capitalize(status, '_', 'ALL_WORDS')}
          </Chip>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="gap-3 pt-3">
        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <span>Due:</span>
          <span className={`font-medium ${isOverdue ? 'text-danger' : ''}`}>
            {format(new Date(dueAt), 'MMM dd, yyyy - HH:mm')}
          </span>
        </div>

        {/* Cleaners */}
        {cleaners.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span>Cleaners:</span>
            {cleaners.map(({ id, name }) => (
              <span key={id}>{name} </span>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex gap-4 text-xs">
          <span>📝 {notes.length} notes</span>
          <span>📷 {images.length} images</span>
        </div>
      </CardBody>
      <TaskDetail
        isOpen={isOpen}
        task={task}
        user={user}
        onClose={() => setIsOpen(false)}
      />
    </Card>
  );
}
