'use client';

import { ClickableNames, RichText } from '@components';
import { Divider } from '@heroui/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import type { TAssignmentResponse } from '@/types';

interface AssignmentDetailsProps {
  assignment: TAssignmentResponse;
  showCreatedAt?: boolean;
}

export function AssignmentDetails({
  assignment,
  showCreatedAt = true,
}: AssignmentDetailsProps) {
  const t = useTranslations('assignment');

  const {
    dueAt,
    cleaners,
    assignedBy,
    createdAt,
    estimatedMinutes,
    actualMinutes,
    room,
  } = assignment;

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* Due Date */}
      <div className="flex justify-between items-center">
        <span className="text-default-600">
          {t('due_at', { default: 'Due' })}:
        </span>
        <span className="font-medium">
          {format(new Date(dueAt), 'EEEE, MMM dd, yyyy - HH:mm')}
        </span>
      </div>

      <Divider />

      {/* Room */}
      <div className="flex justify-between items-center">
        <span className="text-default-600">
          {t('room', { default: 'Room' })}:
        </span>
        <span className="font-medium">
          {room.number}
          {room.floor && ` (Floor ${room.floor})`}
        </span>
      </div>

      <Divider />

      {/* Cleaners */}
      <div className="flex justify-between items-start gap-3">
        <span className="text-default-600 min-w-[80px]">
          {t('cleaners', { default: 'Cleaners' })}:
        </span>
        <div className="flex-1 flex justify-end">
          <ClickableNames users={cleaners} />
        </div>
      </div>

      <Divider />

      {/* Time Tracking */}
      {(estimatedMinutes || actualMinutes) && (
        <>
          <div className="flex justify-between items-center">
            <span className="text-default-600">
              {t('time', { default: 'Time' })}:
            </span>
            <span className="font-medium">
              {actualMinutes
                ? `${actualMinutes} min ${t('actual', { default: '(actual)' })}`
                : estimatedMinutes
                  ? `${estimatedMinutes} min ${t('estimated', { default: '(est.)' })}`
                  : t('not_specified', { default: 'Not specified' })}
            </span>
          </div>
          <Divider />
        </>
      )}

      {/* Assigned By */}
      <div className="flex justify-between items-center">
        <span className="text-default-600">
          {t('assigned_by_label', { default: 'Assigned by' })}:
        </span>
        <span className="font-medium">
          <RichText>
            {(tags) =>
              t.rich('assigned_by', {
                ...tags,
                name:
                  assignedBy?.name ?? t('deleted', { default: 'Deleted user' }),
              })
            }
          </RichText>
        </span>
      </div>

      {/* Created At */}
      {showCreatedAt && (
        <>
          <Divider />
          <div className="flex justify-between items-center">
            <span className="text-default-600">
              {t('created_at_label', { default: 'Created' })}:
            </span>
            <span className="font-medium text-default-500">
              {format(new Date(createdAt), 'MMM dd, yyyy - HH:mm')}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
