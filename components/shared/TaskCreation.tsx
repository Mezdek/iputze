// @TODO add possibility to select room number later
'use client';

import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useCreateTask, useErrorToast, useRoles } from '@hooks';
import { RoleLevel } from '@prisma/client';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';

import TaskForm from '@/components/shared/TaskForm';
import { parseFormData } from '@/lib/client/utils/parseFormData';
import { getRoles } from '@/lib/shared/utils/permissions';
import type { TaskCreationBody, TRoleWithUser } from '@/types';

export function TaskCreation({
  hotelId,
  roomId,
  isDisabled = false,
  defaultDate,
}: {
  hotelId: string;
  roomId?: string;
  isDisabled?: boolean;
  defaultDate?: Date;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: roles } = useRoles({ hotelId });
  const { mutateAsync: createTask } = useCreateTask({ hotelId });
  const t = useTranslations('task.creation');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(roomId ?? '');
  const FORM = 'task_creation_form';

  const allCleaners = getRoles.byLevel<TRoleWithUser>({
    roles: roles ?? [],
    level: RoleLevel.CLEANER,
    activeOnly: true,
  });

  const handleCreate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = parseFormData<TaskCreationBody>(e.currentTarget, {
        cleaners: [],
        dueAt: new Date(),
        roomId: '',
        notes: '',
        priority: 'LOW',
      });
      const dueAt = new FormData(e.currentTarget).get('dueAt')?.slice(0, 19);
      const data: TaskCreationBody = {
        ...formData,
        dueAt: new Date(`${dueAt}`),
        roomId: selectedRoomId,
      };

      await createTask(data);
      onClose();
      addToast({
        title: 'Task Created!',
        description: 'Task created successfully',
        color: 'success',
      });
    } catch (e: unknown) {
      showErrorToast(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        aria-label="+ Assign Task"
        color="primary"
        isDisabled={isDisabled}
        variant="flat"
        onPress={onOpen}
      >
        {t('modal_button')}
      </Button>

      <Modal
        aria-labelledby="create-task-title"
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader id="create-task-title">{t('header')}</ModalHeader>
              <ModalBody>
                <TaskForm
                  cleaners={allCleaners}
                  defaultDate={defaultDate}
                  form={FORM}
                  hotelId={hotelId}
                  roomId={selectedRoomId}
                  setRoomId={setSelectedRoomId}
                  submitHandler={handleCreate}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  {t('inputs.close_button')}
                </Button>
                <Button
                  color="primary"
                  form={FORM}
                  isDisabled={isSubmitting || allCleaners.length === 0}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {t('inputs.submit_button')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
