'use client';
import { ImageGallery, NotesSection } from '@components';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Tooltip,
} from '@heroui/react';
import { capitalize, datefy, STATUS_STYLES } from '@lib/shared';

import type { TaskDetailsProps } from '@/types';

/**
 * TaskDetails Modal (Refactored)
 * Tabbed interface for Overview, Notes, and Images
 */
export function TaskDetails({
  task,
  isOpen,
  onClose,
  viewMode = 'manager',
}: TaskDetailsProps) {
  if (!task) return null;

  const notesCount = task.notes.length;
  const imagesCount = task.images.length;

  return (
    <Modal
      classNames={{
        base: 'max-h-[90vh]',
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Room {task.room.number}</h2>
            <Chip
              color={STATUS_STYLES[task.status].color}
              variant={STATUS_STYLES[task.status].variant}
            >
              {capitalize(task.status, '_', 'FIRST_WORD_ONLY')}
            </Chip>
          </div>
          <span className="text-sm text-default-500 font-normal">
            Assignment Details
          </span>
        </ModalHeader>

        <ModalBody className="px-0">
          <Tabs
            aria-label="Task details tabs"
            classNames={{
              tabList: 'px-6',
              panel: 'px-6 pt-4',
            }}
            color="primary"
            variant="underlined"
          >
            {/* Overview Tab */}
            <Tab key="overview" title="Overview">
              <TaskOverviewSection task={task} />
            </Tab>

            {/* Notes Tab */}
            <Tab
              key="notes"
              title={
                <div className="flex items-center gap-2">
                  <span>Notes</span>
                  {notesCount > 0 && (
                    <Chip
                      className="h-5 min-w-5 px-1"
                      color="secondary"
                      size="sm"
                      variant="flat"
                    >
                      {notesCount}
                    </Chip>
                  )}
                </div>
              }
            >
              <NotesSection
                assignmentId={task.id}
                hotelId={task.room.hotelId}
                notes={task.notes}
                viewMode={viewMode}
              />
            </Tab>

            {/* Images Tab */}
            <Tab
              key="images"
              title={
                <div className="flex items-center gap-2">
                  <span>Images</span>
                  {imagesCount > 0 && (
                    <Chip
                      className="h-5 min-w-5 px-1"
                      color="primary"
                      size="sm"
                      variant="flat"
                    >
                      {imagesCount}
                    </Chip>
                  )}
                </div>
              }
            >
              <ImageGallery
                assignmentId={task.id}
                hotelId={task.room.hotelId}
                images={task.images}
                viewMode={viewMode}
              />
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/**
 * Task Overview Section
 * Displays assignment metadata and timeline
 */
function TaskOverviewSection({ task }: { task: TaskDetailsProps['task'] }) {
  if (!task) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Priority & Room Info */}
      <Card className="shadow-sm">
        <CardBody className="gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-default-600">
              Priority
            </span>
            <Chip
              color={task.priority > 0 ? 'danger' : 'default'}
              size="sm"
              variant="flat"
            >
              {task.priority}
            </Chip>
          </div>

          {task.room.type && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-default-600">
                Room Type
              </span>
              <span className="text-sm">{capitalize(task.room.type)}</span>
            </div>
          )}

          {task.room.floor && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-default-600">
                Floor
              </span>
              <span className="text-sm">{task.room.floor}</span>
            </div>
          )}

          {task.room.capacity && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-default-600">
                Capacity
              </span>
              <span className="text-sm">{task.room.capacity} guests</span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Assignment Info */}
      <Card className="shadow-sm">
        <CardBody className="gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-default-600">
              Assigned By
            </span>
            <span className="text-sm">{task.assignedBy?.name ?? 'System'}</span>
          </div>

          <Divider />

          {/* Cleaners */}
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-default-600">
              Cleaners
            </span>
            <AvatarGroup max={3} size="sm">
              {task.cleaners.map((cleaner) => (
                <Tooltip content={cleaner.name} key={cleaner.id}>
                  <Avatar
                    name={cleaner.name}
                    src={cleaner.avatarUrl ?? undefined}
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          </div>
        </CardBody>
      </Card>

      {/* Timeline */}
      <Card className="shadow-sm">
        <CardBody className="gap-3">
          <p className="text-sm font-semibold text-foreground mb-2">Timeline</p>

          <div className="flex flex-col gap-3">
            <TimelineItem date={task.createdAt} icon="📝" label="Created" />

            {task.startedAt && (
              <TimelineItem date={task.startedAt} icon="▶️" label="Started" />
            )}

            <TimelineItem isHighlight date={task.dueAt} icon="⏰" label="Due" />

            {task.completedAt && (
              <TimelineItem
                date={task.completedAt}
                icon="✅"
                label="Completed"
              />
            )}

            {task.cancelledAt && (
              <TimelineItem
                date={task.cancelledAt}
                icon="❌"
                label="Cancelled"
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Time Tracking */}
      {(task.estimatedMinutes || task.actualMinutes) && (
        <Card className="shadow-sm">
          <CardBody className="gap-3">
            <p className="text-sm font-semibold text-foreground mb-2">
              Time Tracking
            </p>

            {task.estimatedMinutes && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-600">Estimated</span>
                <span className="text-sm font-medium">
                  {task.estimatedMinutes} min
                </span>
              </div>
            )}

            {task.actualMinutes && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-600">Actual</span>
                <Chip
                  color={
                    task.estimatedMinutes &&
                    task.actualMinutes > task.estimatedMinutes
                      ? 'warning'
                      : 'success'
                  }
                  size="sm"
                  variant="flat"
                >
                  {task.actualMinutes} min
                </Chip>
              </div>
            )}

            {task.estimatedMinutes && task.actualMinutes && (
              <div className="flex justify-between items-center pt-2 border-t border-divider">
                <span className="text-sm text-default-600">Variance</span>
                <span
                  className={`text-sm font-semibold ${
                    task.actualMinutes > task.estimatedMinutes
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  {task.actualMinutes > task.estimatedMinutes ? '+' : ''}
                  {task.actualMinutes - task.estimatedMinutes} min
                </span>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Cancellation Note */}
      {task.cancellationNote && (
        <Card className="shadow-sm bg-danger-50 border border-danger-200">
          <CardBody>
            <p className="text-sm font-semibold text-danger mb-2">
              Cancellation Reason
            </p>
            <p className="text-sm text-danger-700">{task.cancellationNote}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

/**
 * Timeline Item Component
 */
function TimelineItem({
  label,
  date,
  icon,
  isHighlight = false,
}: {
  label: string;
  date: Date | null | undefined;
  icon: string;
  isHighlight?: boolean;
}) {
  if (!date) return null;

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg ${
        isHighlight ? 'bg-primary-50 border border-primary-200' : ''
      }`}
    >
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${isHighlight ? 'text-primary' : 'text-foreground'}`}
        >
          {label}
        </p>
        <p className="text-xs text-default-500">{datefy(date)}</p>
      </div>
    </div>
  );
}
