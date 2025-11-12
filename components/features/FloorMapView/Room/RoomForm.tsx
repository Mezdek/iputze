'use client';

import { Form, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { RoomCleanliness, RoomOccupancy } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { ROOM_TYPES, type RoomFormProps } from '@/types';

export function RoomForm({
  room,
  onSubmit,
  mode,
  cleaners,
  ...formProps
}: RoomFormProps) {
  const t = useTranslations(`room`);

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
        errorMessage={t(`${mode}.inputs.floor.error_message`)}
        label={t(`${mode}.inputs.floor.label`)}
        name="floor"
        placeholder={t(`${mode}.inputs.floor.placeholder`)}
        variant="bordered"
      />

      {/* Capacity */}
      <Input
        defaultValue={room?.capacity ? String(room.capacity) : undefined}
        errorMessage={t(`${mode}.inputs.capacity.error_message`)}
        label={t(`${mode}.inputs.capacity.label`)}
        min="1"
        name="capacity"
        placeholder={t(`${mode}.inputs.capacity.placeholder`)}
        type="number"
        variant="bordered"
      />

      {/* Room Type */}
      <Select
        defaultSelectedKeys={room?.type ? [room.type] : [`Standard`]}
        label={t(`${mode}.inputs.type.label`)}
        name="type"
        placeholder={t(`${mode}.inputs.type.placeholder`)}
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

      {/* Default Cleaners Selection */}
      <Select
        fullWidth
        defaultSelectedKeys={room?.defaultCleaners.map(({ id }) => id) ?? []}
        errorMessage={t(`${mode}.inputs.default_cleaners.error_message`)}
        label={t(`${mode}.inputs.default_cleaners.label`)}
        name="defaultCleaners"
        placeholder={t(`${mode}.inputs.default_cleaners.placeholder`)}
        selectionMode="multiple"
      >
        {cleaners.map((cleaner) => (
          <SelectItem key={cleaner.user.id}>{cleaner.user.name}</SelectItem>
        ))}
      </Select>

      {/* Notes */}
      <Textarea
        defaultValue={room?.notes ?? undefined}
        label={t(`${mode}.inputs.notes.label`)}
        maxRows={4}
        minRows={2}
        name="notes"
        placeholder={t(`${mode}.inputs.notes.placeholder`)}
        variant="bordered"
      />
    </Form>
  );
}
