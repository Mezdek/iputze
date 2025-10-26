'use client';

import {
  addToast,
  Button,
  DatePicker,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useCreateAssignment, useErrorToast, useRoles, useRoom } from '@hooks';
import { getLocalTimeZone, today } from '@internationalized/date';
import { getRolesByLevel } from '@lib/server';
import { parseFormData } from '@lib/shared';
import { RoleLevel } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import type { AssignmentCreationBody, TRoleWithUser } from '@/types';

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
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader id="create-assignment-title">
                {t('header')} for Room {room?.number}
              </ModalHeader>

              <ModalBody>
                <Form id={FORM} onSubmit={handleCreate}>
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

                  <DatePicker
                    isRequired
                    defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
                    description={t('inputs.dua_date.description')}
                    errorMessage={t('inputs.dua_date.error_message')}
                    form={FORM}
                    label={t('inputs.dua_date.label')}
                    minValue={today(getLocalTimeZone())}
                    name="dueAt"
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
                  isDisabled={isSubmitting}
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
