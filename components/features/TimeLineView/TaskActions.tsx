'use client';

import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useErrorToast, useUpdateTask } from '@hooks';
import { TaskStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { ApprovalRequest } from '@/components/ui';
import { capitalize } from '@/lib/shared/utils/capitalize';
import { checkRoles } from '@/lib/shared/utils/permissions';
import type { MeResponse, TaskResponse } from '@/types';

const NEXT_STATUS = {
  [TaskStatus.PENDING]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.COMPLETED,
} as const;

interface TaskActionsProps {
  task: TaskResponse;
  compact?: boolean;
  user: MeResponse;
}

export function TaskActions({ task, user, compact = false }: TaskActionsProps) {
  const t = useTranslations('task');
  const { showErrorToast } = useErrorToast();

  const {
    id: taskId,
    status,
    cleaners,
    room: { hotelId },
  } = task;

  const { mutateAsync: update, isPending } = useUpdateTask({
    taskId,
    hotelId,
  });

  const isTaskCleanerFlag = checkRoles.isTaskCleaner({
    cleaners,
    userId: user.id,
  });

  // Only show actions for assigned cleaners and non-completed tasks
  if (!isTaskCleanerFlag || status === TaskStatus.COMPLETED) {
    return null;
  }

  // Check if status can transition
  const nextStatus =
    status === TaskStatus.PENDING || status === TaskStatus.IN_PROGRESS
      ? NEXT_STATUS[status]
      : null;

  if (!nextStatus) return null;

  const handleStatusChange = async () => {
    try {
      await update({ status: nextStatus });
      addToast({
        title: t('status_changed', { default: 'Status Changed!' }),
        description: t('status_changed_desc', {
          status: capitalize(nextStatus, '_', 'ALL_WORDS'),
        }),
        color: 'success',
      });
    } catch (e) {
      showErrorToast(e);
    }
  };

  const buttonText = t(`status.${status}.button`, {
    default: status === TaskStatus.PENDING ? 'Start' : 'Complete',
  });

  return (
    <>
      <Button
        className={compact ? 'text-sm' : 'rounded-lg text-sm font-medium'}
        color={status === TaskStatus.PENDING ? 'primary' : 'success'}
        isDisabled={isPending}
        isLoading={isPending}
        size={compact ? 'sm' : 'md'}
        onPress={handleStatusChange}
      >
        {buttonText}
      </Button>
      {task.status === 'PENDING' && <CancelTask task={task} user={user} />}
    </>
  );
}

function CancelTask({ task, user }: { task: TaskResponse; user: MeResponse }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [cancelationNote, setCancelationNote] = useState<string>();
  const { mutateAsync: update } = useUpdateTask({
    hotelId: task.room.hotelId,
    taskId: task.id,
  });
  const handleSubmit = useCallback(async () => {
    await update({ cancelationNote });
    onClose();
  }, [cancelationNote, onClose, update]);
  return (
    <>
      <Button onPress={onOpen}>Reject</Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Task Cancelation</ModalHeader>
          <ModalBody>
            <Autocomplete
              allowsCustomValue
              isRequired
              defaultItems={cancelationReasons}
              errorMessage={'error'}
              label={'Cancelation Reasons'}
              name="cancelationNote"
              placeholder={'Give a reason'}
              variant="bordered"
              onInputChange={(text) => {
                setCancelationNote(text);
              }}
            >
              {({ key }) => (
                <AutocompleteItem key={key}>
                  {capitalize(key, '_')}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </ModalBody>
          <ModalFooter>
            <ApprovalRequest
              header="Task Cancelation"
              modalButtonProps={{ text: 'Reject' }}
              question="Are you sure you want to reject this task"
              submitHandler={handleSubmit}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const cancelationReasons = [
  { key: 'SICK_VACATION' },
  { key: 'ROOM_UNAVAILABLE' },
  { key: 'MATERIALS_UNAVAILABLE' },
];
