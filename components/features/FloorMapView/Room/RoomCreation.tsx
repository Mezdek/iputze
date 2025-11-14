'use client';

import { Icons, RoomForm } from '@components';
import {
  addToast,
  Button,
  type ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useCreateRoom, useErrorToast, useRoles } from '@hooks';
import { RoleLevel } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import { parseFormData } from '@/lib/client/utils/parseFormData';
import { getRoles } from '@/lib/shared/utils/permissions';
import type {
  RoomCollectionParams,
  RoomCreationBody,
  TRoleWithUser,
} from '@/types';
import { RoomFormModes } from '@/types';

export function RoomCreation({
  hotelId,
  ...buttonProps
}: RoomCollectionParams & ButtonProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutateAsync: createRoom } = useCreateRoom({ hotelId });
  const { data: roles } = useRoles({ hotelId });
  const cleaners = getRoles.byLevel<TRoleWithUser>({
    roles: roles ?? [],
    level: RoleLevel.CLEANER,
    activeOnly: true,
  });
  const t = useTranslations('room');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FORM = 'room_creation_form';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = parseFormData<RoomCreationBody>(e.currentTarget, {
      number: '1',
      capacity: '1',
      cleanliness: 'CLEAN',
      floor: '1',
      notes: '',
      occupancy: 'OCCUPIED',
      type: '',
      defaultCleaners: [],
    });

    try {
      const res = await createRoom(data);
      onClose();
      addToast({
        title: 'Room Created!',
        description: `Room ${res.number} created successfully`,
        color: 'success',
      });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        {...buttonProps}
        aria-label="Add room"
        size="sm"
      >
        {buttonProps.isIconOnly ? <Icons.Plus /> : t('creation.buttons.open')}
      </Button>
      <Modal
        disableAnimation
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
                {t('creation.header')}
              </ModalHeader>
              <ModalBody>
                <RoomForm
                  cleaners={cleaners}
                  id={FORM}
                  mode={RoomFormModes.CREATION}
                  onSubmit={handleSubmit}
                />
              </ModalBody>
              <ModalFooter className="gap-3">
                <Button color="danger" variant="flat" onPress={onClose}>
                  {t('creation.buttons.close')}
                </Button>
                <Button
                  color="primary"
                  form={FORM}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {t('creation.buttons.submit')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
