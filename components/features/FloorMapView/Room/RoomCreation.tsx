'use client';

import { RoomForm } from '@components';
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
import { useCreateRoom, useErrorToast } from '@hooks';
import { RoomCleanliness, RoomOccupancy } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

import { RoomFormModes } from '@/components/features/FloorMapView/Room/types';
import { parseFormData } from '@/lib/client/utils/parseFormData';
import type { RoomCollectionParams, RoomCreationBody } from '@/types';

export function RoomCreation({ hotelId }: RoomCollectionParams) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutateAsync: createRoom } = useCreateRoom({ hotelId });
  const t = useTranslations('room');
  const { showErrorToast } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FORM = 'room_creation_form';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const data = parseFormData<RoomCreationBody>(e.currentTarget, {
      number: '',
      cleanliness: RoomCleanliness.CLEAN,
      occupancy: RoomOccupancy.VACANT,
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
      <Button color="primary" onPress={onOpen}>
        {t('creation.buttons.open')}
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
