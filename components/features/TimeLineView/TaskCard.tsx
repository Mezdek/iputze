'use client';

import {
  ClickableNames,
  ImageGalleryCompact,
  NotesSection,
  RichText,
  TaskHeader,
} from '@components';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardProps,
  Divider,
} from '@heroui/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { checkRoles } from '@/lib/shared/utils/permissions';
import type { MeResponse, TaskResponse, ViewMode } from '@/types';

interface TaskCardProps extends Omit<CardProps, 'children'> {
  task: TaskResponse;
  showNotes?: boolean;
  showImages?: boolean;
  showActions?: boolean;
  user: MeResponse;
}

export function TaskCard({
  task,
  user,
  showNotes = true,
  showImages = false,
  showActions = true,
  ...cardProps
}: TaskCardProps) {
  const t = useTranslations('task');

  const {
    id: taskId,
    dueAt,
    createdAt,
    creator,
    cleaners,
    room: { hotelId },
    images,
  } = task;
  const viewMode: ViewMode = checkRoles.hasManagerPermission({
    hotelId,
    roles: user.roles,
  })
    ? 'manager'
    : 'cleaner';

  return (
    <Card {...cardProps}>
      <CardHeader className="flex flex-col gap-2 pb-2">
        <TaskHeader showActions={showActions} task={task} user={user} />
      </CardHeader>

      <Divider />

      <CardBody className="gap-4">
        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{t('due_at.label')}:</span>
          <RichText>
            {(tags) =>
              t.rich('due_at.date', {
                ...tags,
                dueAt: format(new Date(dueAt), 'MMM dd, yyyy - HH:mm'),
              })
            }
          </RichText>
        </div>

        <Divider />

        {/* Cleaners */}
        <div className="flex flex-col gap-2">
          <RichText>
            {(tags) => (
              <span className="text-sm font-medium">
                {t.rich('cleaners', { ...tags })}:
              </span>
            )}
          </RichText>
          <ClickableNames users={cleaners} />
        </div>

        <Divider />

        {/* Assigned By */}
        <div className="text-sm">
          <RichText>
            {(tags) =>
              t.rich('assigned_by', {
                ...tags,
                name: creator?.name ?? t('deleted'),
              })
            }
          </RichText>
        </div>

        <Divider />

        {/* Created At */}
        <div className="text-sm">
          <RichText>
            {(tags) =>
              t.rich('created_at', {
                ...tags,
                createdAt: format(new Date(createdAt), 'MMM dd, yyyy - HH:mm'),
              })
            }
          </RichText>
        </div>

        {/* Images Preview */}
        {showImages && images.length > 0 && (
          <>
            <Divider />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">
                {t('images')} ({images.length})
              </span>
              <ImageGalleryCompact images={images} />
            </div>
          </>
        )}
      </CardBody>

      {/* Notes Footer */}
      {showNotes && (
        <>
          <Divider />
          <CardFooter className="flex flex-col">
            <NotesSection
              hotelId={hotelId}
              taskId={taskId}
              viewMode={viewMode}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
