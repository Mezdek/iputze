'use client';

import {
  ClickableNames,
  ImageGallery,
  NotesSection,
  RichText,
} from '@components';
import {
  Button,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from '@heroui/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';

import { TASK_STATUS_COLORS } from '@/lib/shared/constants/features/room';
import { capitalize } from '@/lib/shared/utils/capitalize';
import type { TaskResponse } from '@/types';

interface TaskDetailProps {
  task: TaskResponse | null;
  isOpen: boolean;
  onClose: () => void;
  viewMode?: 'manager' | 'cleaner';
}

export function TaskDetail({
  task,
  isOpen,
  onClose,
  viewMode = 'manager',
}: TaskDetailProps) {
  const t = useTranslations('task');
  const [selectedTab, setSelectedTab] = useState<string>('details');

  if (!task) return null;

  const {
    id,
    status,
    dueAt,
    priority,
    cleaners,
    createdAt,
    startedAt,
    completedAt,
    cancelledAt,
    cancellationNote,
    room,
    images,
    creator,
    _count: { notes: notesCount },
  } = task;

  const isOverdue = new Date(dueAt) < new Date() && status !== 'COMPLETED';

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="3xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">
                {t('header', { number: room.number })}
              </h2>
              {isOverdue && (
                <Chip color="danger" size="sm" variant="flat">
                  Overdue
                </Chip>
              )}
            </div>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Chip color={TASK_STATUS_COLORS[status]} size="sm" variant="flat">
              {capitalize(status, '_', 'ALL_WORDS')}
            </Chip>
            {priority !== 'LOW' && (
              <Chip color="warning" size="sm" variant="flat">
                Priority: {priority}
              </Chip>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="pb-6">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            {/* Details Tab */}
            <Tab key="details" title="Details">
              <div className="flex flex-col gap-4 py-4">
                {/* Due Date */}
                <DetailRow
                  label="Due Date"
                  value={
                    <span
                      className={isOverdue ? 'text-danger font-semibold' : ''}
                    >
                      {format(new Date(dueAt), 'MMMM dd, yyyy - HH:mm')}
                    </span>
                  }
                />

                <Divider />

                {/* Cleaners */}
                <DetailRow
                  label="Assigned Cleaners"
                  value={<ClickableNames users={cleaners} />}
                />

                <Divider />

                {/* Assigned By */}
                <DetailRow
                  label="Assigned By"
                  value={
                    <RichText>
                      {(tags) =>
                        t.rich('assigned_by', {
                          ...tags,
                          name: creator?.name ?? t('deleted'),
                        })
                      }
                    </RichText>
                  }
                />

                <Divider />

                {/* Timestamps */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 text-sm">
                  <DetailRow
                    label="Created"
                    value={format(new Date(createdAt), 'MMM dd, yyyy HH:mm')}
                  />
                  <DetailRow
                    label="Started"
                    value={
                      startedAt
                        ? format(new Date(startedAt), 'MMM dd, yyyy HH:mm')
                        : 'N/A'
                    }
                  />

                  <DetailRow
                    label="Completed"
                    value={
                      completedAt
                        ? format(new Date(completedAt), 'MMM dd, yyyy HH:mm')
                        : 'N/A'
                    }
                  />

                  <DetailRow
                    label="Cancelled"
                    value={
                      cancelledAt
                        ? format(new Date(cancelledAt), 'MMM dd, yyyy HH:mm')
                        : 'N/A'
                    }
                  />
                </div>

                {/* Cancellation Note */}
                {cancellationNote && (
                  <>
                    <Divider />
                    <DetailRow
                      label="Cancellation Reason"
                      value={
                        <p className="text-danger italic">{cancellationNote}</p>
                      }
                    />
                  </>
                )}
              </div>
            </Tab>

            {/* Images Tab */}
            <Tab
              key="images"
              title={
                <div className="flex items-center gap-2">
                  <span>Images</span>
                  {images.length > 0 && (
                    <Chip size="sm" variant="flat">
                      {images.length}
                    </Chip>
                  )}
                </div>
              }
            >
              <div className="py-4">
                <ImageGallery
                  hotelId={room.hotelId}
                  images={images}
                  taskId={id}
                  viewMode={viewMode}
                />
              </div>
            </Tab>

            {/* Notes Tab */}
            <Tab
              key="notes"
              title={
                <div className="flex items-center gap-2">
                  <span>Notes</span>
                  {notesCount > 0 && (
                    <Chip size="sm" variant="flat">
                      {notesCount}
                    </Chip>
                  )}
                </div>
              }
            >
              <div className="py-4">
                <NotesSection
                  hotelId={room.hotelId}
                  taskId={id}
                  viewMode={viewMode}
                />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/**
 * Reusable detail row component
 */
function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm font-semibold min-w-[120px]">{label}:</span>
      <div className="flex-1 text-sm text-right">{value}</div>
    </div>
  );
}
