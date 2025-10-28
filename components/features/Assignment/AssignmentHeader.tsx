'use client';

import { AssignmentActions, AssignmentStatus } from '@components';
import { Chip } from '@heroui/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import type { InjectedAuthProps, TAssignmentResponse } from '@/types';

interface AssignmentHeaderProps extends InjectedAuthProps {
  assignment: TAssignmentResponse;
  showActions?: boolean;
}

export function AssignmentHeader({
  assignment,
  user,
  showActions = true,
}: AssignmentHeaderProps) {
  const t = useTranslations('assignment');
  const { room, status, dueAt, priority } = assignment;

  const isOverdue = new Date(dueAt) < new Date() && status !== 'COMPLETED';

  return (
    <div className="flex flex-col gap-3">
      {/* Title and Status */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <h2
            className="text-lg font-bold"
            id={`assignment-${assignment.id}-title`}
          >
            {t('header', { number: room.number })}
          </h2>

          <div className="flex gap-2 flex-wrap items-center">
            <AssignmentStatus status={status} />

            {priority > 0 && (
              <Chip color="warning" size="sm" variant="flat">
                {t('priority', { default: 'Priority' })}: {priority}
              </Chip>
            )}

            {isOverdue && (
              <Chip color="danger" size="sm" variant="flat">
                {t('overdue', { default: 'Overdue' })}
              </Chip>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <AssignmentActions assignment={assignment} user={user} />
        )}
      </div>

      {/* Due Date Highlight if Overdue */}
      {isOverdue && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-2 text-sm">
          <span className="text-danger font-semibold">
            {t('due_date_passed', { default: 'Due date passed' })}:{' '}
          </span>
          <span className="text-danger">
            {format(new Date(dueAt), 'MMM dd, yyyy - HH:mm')}
          </span>
        </div>
      )}
    </div>
  );
}
