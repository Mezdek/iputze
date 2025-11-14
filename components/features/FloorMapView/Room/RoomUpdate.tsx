// @TODO create a constant default form object, for all similar cases as well
'use client';

import { Icons, RoomDeletion, RoomForm } from '@components';
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
import { useErrorToast, useRoles, useUpdateRoom } from '@hooks';
import { RoleLevel } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import { parseFormData } from '@/lib/client/utils/parseFormData';
import { getRoles } from '@/lib/shared/utils/permissions';
import type { RoomUpdateBody, RoomUpdateProps, TRoleWithUser } from '@/types';
import { RoomFormModes } from '@/types';

export function RoomUpdate({
  room,
  isIconOnly,
  ...buttonProps
}: RoomUpdateProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutateAsync: updateRoom } = useUpdateRoom({
    hotelId: room.hotel.id,
    roomId: room.id,
  });
  const t = useTranslations('room');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: roles } = useRoles({ hotelId: room.hotel.id });
  const cleaners = getRoles.byLevel<TRoleWithUser>({
    level: RoleLevel.CLEANER,
    roles: roles ?? [],
    activeOnly: true,
  });

  const FORM = `room_update_form_${room.id}`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = parseFormData<RoomUpdateBody>(e.currentTarget, {
      capacity: 1,
      cleanliness: 'DIRTY',
      floor: '1',
      notes: '',
      number: '1',
      occupancy: 'VACANT',
      type: '',
      defaultCleaners: [],
    });

    const data: RoomUpdateBody = {
      ...formData,
      capacity: Number(formData.capacity),
    };
    try {
      await updateRoom(data);
      onClose();
      addToast({
        title: 'Room Updated!',
        description: `Room #${data.number || room.number} has been updated successfully`,
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
        aria-label={`Edit room ${room.number}`}
        color="default"
        isIconOnly={isIconOnly}
        onPress={onOpen}
        {...buttonProps}
        size="sm"
      >
        {isIconOnly ? <Icons.Cog /> : t('update.buttons.open')}
      </Button>
      <Modal
        disableAnimation
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t('update.header', { number: room.number })}
              </ModalHeader>
              <ModalBody>
                <RoomForm
                  cleaners={cleaners}
                  id={FORM}
                  mode={RoomFormModes.UPDATE}
                  room={room}
                  onSubmit={handleSubmit}
                />
              </ModalBody>
              <ModalFooter className="gap-3">
                <RoomDeletion
                  room={room}
                  submitButtonProps={{ color: 'danger' }}
                />
                <Button
                  color="secondary"
                  variant="shadow"
                  onPress={onCloseModal}
                >
                  {t('update.buttons.close')}
                </Button>
                <Button
                  color="primary"
                  form={FORM}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {t('update.buttons.submit')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
