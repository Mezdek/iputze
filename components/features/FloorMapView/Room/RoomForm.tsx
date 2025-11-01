'use client';

import { Form, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { RoomCleanliness, RoomOccupancy } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { ROOM_TYPES, type RoomFormProps } from './types';

export function RoomForm({
  room,
  onSubmit,
  mode,
  ...formProps
}: RoomFormProps) {
  const t = useTranslations('room');

  return (
    <Form className="flex flex-col gap-4" onSubmit={onSubmit} {...formProps}>
      {/* Room Number */}
      <Input
        required
        defaultValue={room?.number}
        errorMessage={t(`${mode}.inputs.room_number.error_message`)}
        label={t(`${mode}.inputs.room_number.label`)}
        name="number"
        placeholder={t(`${mode}.inputs.room_number.placeholder`)}
        variant="bordered"
      />

      {/* Floor */}
      <Input
        defaultValue={room?.floor ?? undefined}
        errorMessage={t('form.inputs.floor.error_message')}
        label={t('form.inputs.floor.label', { default: 'Floor' })}
        name="floor"
        placeholder={t('form.inputs.floor.placeholder', {
          default: 'e.g., 1, 2, G',
        })}
        variant="bordered"
      />

      {/* Capacity */}
      <Input
        defaultValue={room?.capacity ? String(room.capacity) : undefined}
        errorMessage={t('form.inputs.capacity.error_message')}
        label={t('form.inputs.capacity.label', { default: 'Capacity' })}
        min="1"
        name="capacity"
        placeholder={t('form.inputs.capacity.placeholder', {
          default: 'Number of guests',
        })}
        type="number"
        variant="bordered"
      />

      {/* Room Type */}
      <Select
        defaultSelectedKeys={room?.type ? [room.type] : ['Standard']}
        label={t('form.inputs.type.label', { default: 'Room Type' })}
        name="type"
        placeholder={t('form.inputs.type.placeholder', {
          default: 'Select room type',
        })}
        variant="bordered"
      >
        {ROOM_TYPES.map((type) => (
          <SelectItem key={type}>{type}</SelectItem>
        ))}
      </Select>

      {/* Cleanliness Status */}
      <Select
        required
        defaultSelectedKeys={
          room ? [room.cleanliness] : [RoomCleanliness.CLEAN]
        }
        label={t(`${mode}.inputs.cleanliness.label`)}
        name="cleanliness"
        placeholder={t(`${mode}.inputs.cleanliness.placeholder`)}
        variant="bordered"
      >
        {Object.values(RoomCleanliness).map((status) => (
          <SelectItem key={status}>
            {t(`cleanliness_status.${status}`)}
          </SelectItem>
        ))}
      </Select>

      {/* Occupancy Status */}
      <Select
        required
        defaultSelectedKeys={room ? [room.occupancy] : [RoomOccupancy.VACANT]}
        label={t(`${mode}.inputs.occupancy.label`)}
        name="occupancy"
        placeholder={t(`${mode}.inputs.occupancy.placeholder`)}
        variant="bordered"
      >
        {Object.values(RoomOccupancy).map((status) => (
          <SelectItem key={status}>
            {t(`occupancy_status.${status}`)}
          </SelectItem>
        ))}
      </Select>

      {/* Notes */}
      <Textarea
        defaultValue={room?.notes ?? undefined}
        label={t('form.inputs.notes.label', { default: 'Notes' })}
        maxRows={4}
        minRows={2}
        name="notes"
        placeholder={t('form.inputs.notes.placeholder', {
          default: 'Additional information about the room',
        })}
        variant="bordered"
      />
    </Form>
  );
}
