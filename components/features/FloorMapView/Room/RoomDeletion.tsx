'use client';

import { ApprovalRequest } from '@components';
import { addToast } from '@heroui/react';
import { useDeleteRoom, useErrorToast } from '@hooks';
import { useTranslations } from 'next-intl';

import { filterDefinedProps } from '@/lib/shared/validation/filterDefinedProps';
import type { RoomDeletionProps } from '@/types';

export function RoomDeletion({ room, ...props }: RoomDeletionProps) {
  const { mutateAsync: deleteRoom } = useDeleteRoom({
    hotelId: room.hotel.id,
    roomId: room.id,
  });
  const t = useTranslations('room.deletion');
  const { showErrorToast } = useErrorToast();

  const handleDelete = async () => {
    try {
      await deleteRoom();
      addToast({
        title: 'Room deleted successfully',
        description: `Room ${room.number} was deleted successfully`,
        color: 'success',
      });
    } catch (e) {
      showErrorToast(e);
    }
  };

  const validProps = filterDefinedProps(props);
  const { modalButtonProps, submitButtonProps, ...rest } = validProps;

  return (
    <ApprovalRequest
      header={t('header')}
      modalButtonProps={{
        text: t('buttons.open'),
        color: 'danger',
        title: 'Delete',
        ...modalButtonProps,
      }}
      question={t('approval_question', { number: room.number })}
      submitButtonProps={{
        text: t('buttons.submit'),
        submitHandler: handleDelete,
        title: 'Delete',
        ...submitButtonProps,
      }}
      {...rest}
    />
  );
}
