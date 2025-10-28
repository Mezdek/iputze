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
import { useCreateAssignment, useErrorToast, useRoles, useRoom } from '@hooks';
import { getLocalTimeZone, now, today } from '@internationalized/date';
import { getRolesByLevel } from '@lib/server';
import { parseFormData } from '@lib/shared';
import { RoleLevel } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import type { AssignmentCreationBody, TRoleWithUser } from '@/types';

const PRIORITY_OPTIONS = [
  { value: 0, label: 'Normal' },
  { value: 1, label: 'Low Priority' },
  { value: 2, label: 'Medium Priority' },
  { value: 3, label: 'High Priority' },
  { value: 4, label: 'Urgent' },
];

export function AssignmentCreation({
  roomId,
  hotelId,
}: {
  hotelId: string;
  roomId: string;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: roles } = useRoles({ hotelId });
  const { data: room } = useRoom({ hotelId, roomId });
  const { mutateAsync: createAssignment } = useCreateAssignment({ hotelId });
  const t = useTranslations('assignment.creation');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const FORM = 'assignment_creation_form';

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
      const data = parseFormData<AssignmentCreationBody>(e.currentTarget, {
        cleaners: [],
        dueAt: new Date(),
        roomId,
      });
      await createAssignment(data);
      onClose();
      addToast({
        title: 'Assignment Created!',
        description: 'Assignment created successfully',
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
        aria-label="Create assignment"
        className="w-full"
        color="primary"
        onPress={onOpen}
      >
        {t('modal_button')}
      </Button>

      <Modal
        aria-labelledby="create-assignment-title"
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader id="create-assignment-title">
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
                      defaultValue={now(getLocalTimeZone())}
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
                    defaultSelectedKeys={['0']}
                    description={t('inputs.priority.description', {
                      default: 'Set task priority level',
                    })}
                    form={FORM}
                    label={t('inputs.priority.label', { default: 'Priority' })}
                    name="priority"
                    placeholder={t('inputs.priority.placeholder', {
                      default: 'Select priority',
                    })}
                  >
                    {PRIORITY_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={String(value)}>
                        {t(
                          `inputs.priority.options.${label.toLowerCase().replace(' ', '_')}`,
                          {
                            default: label,
                          }
                        )}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Estimated Minutes */}
                  <Input
                    description={t('inputs.estimated_minutes.description', {
                      default: 'Expected time to complete (optional)',
                    })}
                    form={FORM}
                    label={t('inputs.estimated_minutes.label', {
                      default: 'Estimated Time (minutes)',
                    })}
                    min="1"
                    name="estimatedMinutes"
                    placeholder={t('inputs.estimated_minutes.placeholder', {
                      default: 'e.g., 30',
                    })}
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
