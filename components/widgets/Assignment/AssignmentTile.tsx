'use client';
//TODO this needs a complete rework
import { ClickableNames, Notes, RichText, Tile } from '@components';
import { addToast, Button } from '@heroui/react';
import { useErrorToast, useUpdateAssignment } from '@hooks';
import { AssignmentStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { capitalize, isAssignmentCleaner } from '@/lib';
import type { InjectedAuthProps, TAssignmentResponse } from '@/types';

import { dateAndTime, NEXT_STATUS, STATUS_STRING } from '../../utils';

export function AssignmentTile({
  assignment,
  user,
}: { assignment: TAssignmentResponse } & InjectedAuthProps) {
  const {
    createdAt,
    dueAt,
    id: assignmentId,
    room: { hotelId, number },
    status,
    assignedBy,
    cleaners,
  } = assignment;

  const t = useTranslations('assignment');
  const { showErrorToast } = useErrorToast();

  const { mutateAsync: update, isPending } = useUpdateAssignment({
    assignmentId,
    hotelId,
  });

  const isAssignmentCleanerFlag = isAssignmentCleaner({ cleaners, user });

  const handleStatus = async () => {
    let newStatus;
    if (status === 'PENDING' || status === 'IN_PROGRESS') {
      newStatus = NEXT_STATUS[status];
    }
    if (!newStatus) return;
    try {
      await update({ status: newStatus });
      addToast({
        title: 'Status Changed!',
        description: `Assignment set to ${capitalize(STATUS_STRING[newStatus].state, '_', 'ALL_WORDS')}`,
        color: 'success',
      });
    } catch (e) {
      showErrorToast(e);
    }
  };

  return (
    <Tile
      body={
        <>
          <p>
            {t.rich('due_at', {
              strong: (chunks) => <strong>{chunks}</strong>,
              dueAt: dateAndTime({ dateTime: dueAt }),
            })}
          </p>
          <p className="flex justify-between items-center"></p>
          <div>
            <RichText>{(tags) => t.rich('cleaners', { ...tags })}</RichText>
            <ClickableNames users={cleaners} />
          </div>
          <RichText>
            {(tags) =>
              t.rich('assigned_by', {
                ...tags,
                name: assignedBy?.name ?? t('deleted'),
              })
            }
          </RichText>
          <p>
            {t.rich('created_at', {
              strong: (chunks) => <strong>{chunks}</strong>,
              createdAt: dateAndTime({ dateTime: createdAt }),
            })}
          </p>
        </>
      }
      footer={
        <Notes assignmentId={assignmentId} hotelId={hotelId} userId={user.id} />
      }
      header={
        <>
          <div className="flex flex-col">
            <h2 id={`assignment-${assignmentId}-title`}>
              {t('header', { number })}
            </h2>
            <h3 className="text-sm italic">{t(`status.${status}.state`)}</h3>
          </div>
          {isAssignmentCleanerFlag && status !== AssignmentStatus.COMPLETED && (
            <Button
              className="rounded-lg text-sm font-medium"
              color="success"
              disabled={isPending}
              onPress={handleStatus}
            >
              {t(`status.${status}.button`)}
            </Button>
          )}
        </>
      }
    />
  );
}
