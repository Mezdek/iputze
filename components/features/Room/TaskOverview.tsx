'use client';
import { TaskDetails } from '@components';
import { Avatar, AvatarGroup, Tooltip } from '@heroui/react';
import { capitalize } from '@lib/shared';
import { useState } from 'react';

import type { SafeUser, TAssignmentResponse } from '@/types';

export function TasksOverview({
  task,
  defaultCleaners = [],
}: {
  task: TAssignmentResponse;
  defaultCleaners?: { user: SafeUser }[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <p className="font-semibold mb-2">Current Assignment</p>
      <div className="bg-warning-50 p-3 rounded-lg">
        <div className="flex justify-between">
          <p className="text-warning-800 font-medium">
            {capitalize(task.status, '_', 'ALL_WORDS')}
          </p>
          <TaskDetails
            isOpen={isOpen}
            task={task}
            onClose={() => setIsOpen(false)}
          />
        </div>
        {task.startedAt && (
          <p className="text-warning-600 text-sm">
            Started: {new Date(task.startedAt).toLocaleTimeString('de')}
          </p>
        )}
        <AvatarGroup className="mt-2" size="sm">
          {task.cleaners.map((user) => (
            <Tooltip content={user.name} key={user.id}>
              <Avatar src={user.avatarUrl ?? undefined} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </div>
      {defaultCleaners.length > 0 && (
        <div>
          <p className="font-semibold mb-2">Default Cleaners</p>
          <AvatarGroup size="sm">
            {defaultCleaners.map(({ user }) => (
              <Avatar key={user.id} name={user.name} />
            ))}
          </AvatarGroup>
        </div>
      )}
    </div>
  );
}
