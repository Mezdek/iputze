'use client';

import { Icons, Room } from '@components';
import {
  addToast,
  Button,
  type ButtonProps,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import { useErrorToast, useUpdateRoom } from '@hooks';
import { parseFormData } from '@lib';
import type { Room as TRoom } from '@prisma/client';
import { RoomCleanliness, RoomOccupancy } from '@prisma/client';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';

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
  const FORM = `room_update_form_${room.id}`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = parseFormData<RoomUpdateBody>(e.currentTarget, {});
    try {
      await updateRoom(data);
      onClose();
      addToast({
        title: 'Room Updated!',
        description: `Room #${data.number} has been updated successfully`,
        color: 'success',
      });
    } catch (e: unknown) {
      showErrorToast(e);
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
                <Form
                  className="grid grid-cols-2"
                  id={FORM}
                  onSubmit={handleSubmit}
                >
                  <Input
                    required
                    className="w-full"
                    defaultValue={room.number}
                    errorMessage={t(
                      'update_panel.inputs.room_number.error_message'
                    )}
                    form={FORM}
                    label={t('update_panel.inputs.room_number.label')}
                    name="number"
                    placeholder={t(
                      'update_panel.inputs.room_number.placeholder'
                    )}
                    variant="bordered"
                  />
                  <Input
                    required
                    className="w-full"
                    defaultValue={room.floor ?? undefined}
                    errorMessage={t(
                      'update_panel.inputs.room_number.error_message'
                    )}
                    form={FORM}
                    label={'floor'}
                    name="floor"
                    placeholder={'floor'}
                    variant="bordered"
                  />
                  <Input
                    required
                    className="w-full"
                    defaultValue={
                      room.capacity ? `${room.capacity}` : undefined
                    }
                    errorMessage={t(
                      'update_panel.inputs.room_number.error_message'
                    )}
                    form={FORM}
                    label={'capacity'}
                    name="capacity"
                    placeholder={'capacity'}
                    variant="bordered"
                  />
                  <Select
                    required
                    className="w-full"
                    defaultSelectedKeys={[room.type ?? 'Single']}
                    form={FORM}
                    label={'type'}
                    name="type"
                    // placeholder={'type'}
                  >
                    {Object.values([
                      'Single',
                      'Suite',
                      'Standard',
                      'Deluxe',
                    ]).map((status) => (
                      <SelectItem key={status}>{status}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    required
                    className="w-full"
                    defaultSelectedKeys={[room.cleanliness]}
                    form={FORM}
                    label={t('update_panel.inputs.cleanliness.label')}
                    name="cleanliness"
                    placeholder={t(
                      'update_panel.inputs.cleanliness.placeholder'
                    )}
                  >
                    {Object.values(RoomCleanliness).map((status) => (
                      <SelectItem key={status}>
                        {t(`cleanliness_status.${status}`)}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    required
                    className="w-full"
                    defaultSelectedKeys={[room.occupancy]}
                    form={FORM}
                    label={t('update_panel.inputs.occupancy.label')}
                    name="occupancy"
                    placeholder={t('update_panel.inputs.occupancy.placeholder')}
                  >
                    {Object.values(RoomOccupancy).map((status) => (
                      <SelectItem key={status}>
                        {t(`occupancy_status.${status}`)}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    required
                    className="w-full col-span-2"
                    defaultValue={room.notes ?? ''}
                    errorMessage={t(
                      'update_panel.inputs.room_number.error_message'
                    )}
                    form={FORM}
                    label={'notes'}
                    maxLength={30}
                    name="notes"
                    placeholder={'write a note...'}
                    variant="bordered"
                  />
                </Form>
              </ModalBody>
              <ModalFooter className="gap-3">
                <Room.RoomDeletion
                  modalButtonProps={{ text: '' }}
                  room={room}
                />
                <Button color="danger" variant="flat" onPress={onCloseModal}>
                  {t('update_panel.buttons.close')}
                </Button>
                <Button color="primary" form={FORM} type="submit">
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
