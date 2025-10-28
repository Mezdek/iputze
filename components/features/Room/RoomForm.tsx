'use client';

import {
  Form,
  type FormProps,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import { type Room, RoomCleanliness, RoomOccupancy } from '@prisma/client';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';

interface RoomFormProps extends Omit<FormProps, 'onSubmit'> {
  room?: Room;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  mode: 'create' | 'update';
}

const ROOM_TYPES = ['Single', 'Double', 'Suite', 'Standard', 'Deluxe'] as const;

export function RoomForm({
  room,
  onSubmit,
  mode,
  ...formProps
}: RoomFormProps) {
  const t = useTranslations('room');
  const isUpdate = mode === 'update';
  const panelKey = isUpdate ? 'update_panel' : 'creation_panel';

  return (
    <Form className="flex flex-col gap-4" onSubmit={onSubmit} {...formProps}>
      {/* Room Number */}
      <Input
        required
        defaultValue={room?.number}
        errorMessage={t(`${panelKey}.inputs.room_number.error_message`)}
        label={t(`${panelKey}.inputs.room_number.label`)}
        name="number"
        placeholder={t(`${panelKey}.inputs.room_number.placeholder`)}
        variant="bordered"
      />

      {/* Floor */}
      <Input
        defaultValue={room?.floor ?? undefined}
        errorMessage={t('inputs.floor.error_message')}
        label={t('inputs.floor.label', { default: 'Floor' })}
        name="floor"
        placeholder={t('inputs.floor.placeholder', {
          default: 'e.g., 1, 2, G',
        })}
        variant="bordered"
      />

      {/* Capacity */}
      <Input
        defaultValue={room?.capacity ? String(room.capacity) : undefined}
        errorMessage={t('inputs.capacity.error_message')}
        label={t('inputs.capacity.label', { default: 'Capacity' })}
        min="1"
        name="capacity"
        placeholder={t('inputs.capacity.placeholder', {
          default: 'Number of guests',
        })}
        type="number"
        variant="bordered"
      />

      {/* Room Type */}
      <Select
        defaultSelectedKeys={room?.type ? [room.type] : ['Standard']}
        label={t('inputs.type.label', { default: 'Room Type' })}
        name="type"
        placeholder={t('inputs.type.placeholder', {
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
        label={t(`${panelKey}.inputs.cleanliness.label`)}
        name="cleanliness"
        placeholder={t(`${panelKey}.inputs.cleanliness.placeholder`)}
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
        label={t(`${panelKey}.inputs.occupancy.label`)}
        name="occupancy"
        placeholder={t(`${panelKey}.inputs.occupancy.placeholder`)}
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
        label={t('inputs.notes.label', { default: 'Notes' })}
        maxRows={4}
        minRows={2}
        name="notes"
        placeholder={t('inputs.notes.placeholder', {
          default: 'Additional information about the room',
        })}
        variant="bordered"
      />
    </Form>
  );
}
