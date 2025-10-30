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
import { useErrorToast, useUpdateRoom } from '@hooks';
import { parseFormData } from '@lib/shared';
import type { Room as TRoom } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import type { RoomUpdateBody } from '@/types';

export function RoomUpdate({
  room,
  isIconOnly,
  ...buttonProps
}: {
  room: TRoom;
  isIconOnly?: boolean;
} & ButtonProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutateAsync: updateRoom } = useUpdateRoom({
    hotelId: room.hotelId,
    roomId: room.id,
  });
  const t = useTranslations('room');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const FORM = `room_update_form_${room.id}`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = parseFormData<RoomUpdateBody>(e.currentTarget, {});

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
        color="secondary"
        isIconOnly={isIconOnly}
        onPress={onOpen}
        {...buttonProps}
        className="py-1 px-2"
        size="lg"
      >
        {isIconOnly ? (
          <Icons.Pencil className="size-9" />
        ) : (
          t('update_panel.buttons.open')
        )}
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
                {t('update_panel.header', { number: room.number })}
              </ModalHeader>
              <ModalBody>
                <RoomForm
                  id={FORM}
                  mode="update"
                  room={room}
                  onSubmit={handleSubmit}
                />
              </ModalBody>
              <ModalFooter className="gap-3">
                <Button color="danger" variant="flat" onPress={onCloseModal}>
                  {t('update_panel.buttons.close')}
                </Button>
                <Button
                  color="primary"
                  form={FORM}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {t('update_panel.buttons.submit')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
