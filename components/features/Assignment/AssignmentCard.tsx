'use client';

import {
  AssignmentHeader,
  ClickableNames,
  ImageGalleryCompact,
  NotesSection,
  RichText,
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
import { useState } from 'react';

import { hasManagerPermission } from '@/lib/server';
import type { InjectedAuthProps, TAssignmentResponse, ViewMode } from '@/types';

interface AssignmentCardProps
  extends InjectedAuthProps,
    Omit<CardProps, 'children'> {
  assignment: TAssignmentResponse;
  showNotes?: boolean;
  showImages?: boolean;
  showActions?: boolean;
}

export function AssignmentCard({
  assignment,
  user,
  showNotes = true,
  showImages = false,
  showActions = true,
  ...cardProps
}: AssignmentCardProps) {
  const t = useTranslations('assignment');

  const [showFullNotes, setShowFullNotes] = useState(false);

  const {
    id: assignmentId,
    dueAt,
    createdAt,
    assignedBy,
    cleaners,
    estimatedMinutes,
    actualMinutes,
    room: { hotelId },
    notes,
    images,
  } = assignment;
  const viewMode: ViewMode = hasManagerPermission({
    hotelId,
    roles: user.roles,
  })
    ? 'manager'
    : 'cleaner';

  return (
    <Card {...cardProps}>
      <CardHeader className="flex flex-col gap-2 pb-2">
        <AssignmentHeader
          assignment={assignment}
          showActions={showActions}
          user={user}
        />
      </CardHeader>

      <Divider />

      <CardBody className="gap-4">
        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-default-600 font-medium">
            {t('due_at_label', { default: 'Due' })}:
          </span>
          <RichText>
            {(tags) =>
              t.rich('due_at', {
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
              <span className="text-sm text-default-600 font-medium">
                {t.rich('cleaners', { ...tags })}:
              </span>
            )}
          </RichText>
          <ClickableNames users={cleaners} />
        </div>

        <Divider />

        {/* Time Tracking */}
        {(estimatedMinutes || actualMinutes) && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {estimatedMinutes && (
                <div>
                  <span className="text-default-600 block">
                    {t('estimated_time', { default: 'Estimated' })}
                  </span>
                  <span className="font-medium">{estimatedMinutes} min</span>
                </div>
              )}
              {actualMinutes && (
                <div>
                  <span className="text-default-600 block">
                    {t('actual_time', { default: 'Actual' })}
                  </span>
                  <span className="font-medium">{actualMinutes} min</span>
                </div>
              )}
            </div>
            <Divider />
          </>
        )}

        {/* Assigned By */}
        <div className="text-sm">
          <RichText>
            {(tags) =>
              t.rich('assigned_by', {
                ...tags,
                name: assignedBy?.name ?? t('deleted'),
              })
            }
          </RichText>
        </div>

        <Divider />

        {/* Created At */}
        <div className="text-sm text-default-500">
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
                {t('images', { default: 'Images' })} ({images.length})
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
              assignmentId={assignmentId}
              hotelId={hotelId}
              notes={notes}
              viewMode={viewMode}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
