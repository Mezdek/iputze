// @TODO add possibility to select room number later
'use client';

import {
  addToast,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  TimeInput,
  useDisclosure,
} from '@heroui/react';
import { useCreateTask, useErrorToast, useRoles, useRoom } from '@hooks';
import { getLocalTimeZone, now, today } from '@internationalized/date';
import { getRolesByLevel } from '@lib/server';
import { parseFormData } from '@lib/shared';
import { RoleLevel, TaskPriority } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import type { TaskCreationBody, TRoleWithUser } from '@/types';

export function TaskCreation({
  roomId,
  hotelId,
}: {
  hotelId: string;
  roomId: string;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: roles } = useRoles({ hotelId });
  const { data: room } = useRoom({ hotelId, roomId });
  const { mutateAsync: createTask } = useCreateTask({ hotelId });
  const t = useTranslations('task.creation');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const FORM = 'task_creation_form';

  const allCleaners = getRolesByLevel<TRoleWithUser>({
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
        roomId,
        estimatedMinutes: 0,
        notes: '',
        priority: 'LOW',
      });
      const dueAt = new FormData(e.currentTarget).get('dueAt');
      const dueTime = new FormData(e.currentTarget).get('dueTime');
      const data: TaskCreationBody = {
        ...formData,
        dueAt: new Date(`${dueAt} ${dueTime}`),
        estimatedMinutes: Number(formData.estimatedMinutes),
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
        aria-label="Create task"
        className="w-full"
        color="primary"
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
              <ModalHeader id="create-task-title">
                {t('header')} for Room {room?.number}
              </ModalHeader>

              <ModalBody>
                <Form
                  className="flex flex-col gap-4"
                  id={FORM}
                  onSubmit={handleCreate}
                >
                  {/* Cleaners Selection */}
                  <Select
                    fullWidth
                    isRequired
                    errorMessage={t('inputs.cleaners.error_message')}
                    form={FORM}
                    isDisabled={allCleaners.length === 0}
                    label={t('inputs.cleaners.label')}
                    name="cleaners"
                    placeholder={t('inputs.cleaners.placeholder')}
                    selectionMode="multiple"
                  >
                    {allCleaners.map(({ user }) => (
                      <SelectItem key={user.id}>{user.name}</SelectItem>
                    ))}
                  </Select>

                  {allCleaners.length === 0 && (
                    <p className="text-sm text-danger">
                      {t('no_cleaners', {
                        default:
                          'No cleaners available. Please add cleaners first.',
                      })}
                    </p>
                  )}

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                      isRequired
                      defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
                      description={t('inputs.due_date.description')}
                      errorMessage={t('inputs.due_date.error_message')}
                      form={FORM}
                      label={t('inputs.due_date.label', {
                        default: 'Due Date',
                      })}
                      minValue={today(getLocalTimeZone())}
                      name="dueAt"
                    />

                    <TimeInput
                      defaultValue={now(getLocalTimeZone()).set({ hour: 11 })}
                      description={t('inputs.due_time.description', {
                        default: 'Select time',
                      })}
                      form={FORM}
                      hourCycle={24}
                      label={t('inputs.due_time.label', {
                        default: 'Due Time',
                      })}
                      name="dueTime"
                    />
                  </div>

                  {/* Priority */}
                  <Select
                    defaultSelectedKeys={[TaskPriority.MEDIUM]}
                    description={t('inputs.priority.description')}
                    form={FORM}
                    label={t('inputs.priority.label')}
                    name="priority"
                    placeholder={t('inputs.priority.placeholder')}
                  >
                    {Object.values(TaskPriority).map((priority) => (
                      <SelectItem key={priority}>
                        {t(`inputs.priority.options.${priority}`)}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Estimated Minutes */}
                  <Input
                    defaultValue="45"
                    description={t('inputs.estimated_minutes.description')}
                    form={FORM}
                    inputMode="numeric"
                    label={t('inputs.estimated_minutes.label')}
                    max="120"
                    min="15"
                    name="estimatedMinutes"
                    placeholder={t('inputs.estimated_minutes.placeholder')}
                    step="5"
                    type="number"
                  />
                </Form>
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
