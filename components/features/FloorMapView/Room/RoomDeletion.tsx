'use client';

import { ApprovalRequest } from '@components';
import { addToast } from '@heroui/react';
import { useDeleteRoom, useErrorToast } from '@hooks';
import { useTranslations } from 'next-intl';

import { filterDefinedProps } from '@/lib/shared/validation/filterDefinedProps';

import type { RoomDeletionProps } from './types';

export function RoomDeletion({
  hotelId,
  roomId,
  roomNumber,
  ...props
}: RoomDeletionProps) {
  const { mutateAsync: deleteRoom } = useDeleteRoom({ hotelId, roomId });
  const t = useTranslations('room.deletion');
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

  const validProps = filterDefinedProps(props);

  return (
    <ApprovalRequest
      header={t('header')}
      modalButtonProps={{
        text: t('buttons.open'),
        color: 'warning',
        title: 'Delete',
      }}
      question={t('approval_question', { number: roomNumber })}
      submitButtonProps={{
        text: t('buttons.submit'),
        color: 'warning',
        submitHandler: handleDelete,
        title: 'Delete',
      }}
      {...validProps}
    />
  );
}
