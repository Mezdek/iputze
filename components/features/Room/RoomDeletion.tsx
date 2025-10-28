'use client';

import { ApprovalRequest, type ApprovalRequestProps } from '@components';
import { addToast } from '@heroui/react';
import { useDeleteRoom, useErrorToast } from '@hooks';
import type { Room } from '@prisma/client';
import { useTranslations } from 'next-intl';

export function RoomDeletion({
  room,
  ...props
}: { room: Room } & Partial<ApprovalRequestProps>) {
  const { hotelId, id: roomId, number: roomNumber } = room;
  const { mutateAsync: deleteRoom } = useDeleteRoom({ hotelId, roomId });
  const t = useTranslations('room.deletion_panel');
  const { showErrorToast } = useErrorToast();

  const handleDelete = async () => {
    try {
      await deleteRoom();
      addToast({
        title: 'Room deleted successfully',
        description: `Room ${roomNumber} was deleted successfully`,
        color: 'success',
      });
    } catch (e) {
      showErrorToast(e);
    }
  };

  const validateProps = <T extends Record<string, unknown>>(
    props: T
  ): Partial<T> => {
    const entries = Object.entries(props);
    const validatedEntries = entries.filter((entry) => entry[1] !== undefined);
    const valid = Object.fromEntries(validatedEntries);
    return valid as Partial<T>;
  };

  const validProps = validateProps(props);

  return (
    <ApprovalRequest
      header={t('header')}
      modalButtonProps={{
        text: t('buttons.open'),
        color: 'warning',
        title: 'Hello',
      }}
      question={t('approval_question', { number: room.number })}
      submitButtonProps={{
        text: t('buttons.submit'),
        color: 'warning',
        submitHandler: handleDelete,
        title: 'Hi',
      }}
      {...validProps}
    />
  );
}
