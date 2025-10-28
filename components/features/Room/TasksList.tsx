'use client';
import { Room } from '@components';
import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
} from '@heroui/react';
import { capitalize } from '@lib/shared';
import type { AssignmentStatus } from '@prisma/client';
import { useState } from 'react';

import type { TAssignmentResponse } from '@/types';

export function TasksList({
  status,
  tasks,
}: {
  status: AssignmentStatus | undefined;
  tasks: TAssignmentResponse[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filtered = status
    ? tasks.filter((task) => task.status === status)
    : tasks;

  return filtered.length > 0 ? (
    filtered.map((task, index, { length }) => (
      <Card className="rounded-2xl min-h-fit" key={task.id + index}>
        <CardHeader className="flex justify-between">
          <p className="text-sm">
            {index + 1}/{length}
          </p>
          <Room.TaskDetails
            isOpen={isOpen}
            task={task}
            onClose={() => setIsOpen(false)}
          />
        </CardHeader>
        <CardBody className="gap-2">
          <p>Status: {capitalize(task.status, '_', 'FIRST_WORD_ONLY')}</p>
          <p>
            Created:{' '}
            {new Date(task.createdAt).toLocaleDateString('de', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <AvatarGroup className="pl-2.5">
            {task.cleaners.map(({ id, name, avatarUrl }) => (
              <Tooltip content={name} key={id}>
                <Avatar name={name} src={avatarUrl ?? undefined} />
              </Tooltip>
            ))}
          </AvatarGroup>
        </CardBody>
      </Card>
    ))
  ) : (
    <p>There are no tasks under this category</p>
  );
}
