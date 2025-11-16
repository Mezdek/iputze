'use client';
import {
  Autocomplete,
  AutocompleteItem,
  DatePicker,
  Form,
  Select,
  SelectItem,
} from '@heroui/react';
import {
  fromDate,
  getLocalTimeZone,
  now,
  today,
} from '@internationalized/date';
import { TaskPriority } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent } from 'react';

import { useRooms } from '@/hooks';
import type { TRoleWithUser } from '@/types';

type TRoomNumber = {
  id: string;
  number: string;
};

export default function TaskForm({
  cleaners,
  form,
  hotelId,
  roomId,
  submitHandler,
  setRoomId,
  defaultDate,
}: {
  cleaners: TRoleWithUser[];
  form: string;
  hotelId: string;
  roomId?: string;
  submitHandler: (event: FormEvent<HTMLFormElement>) => void;
  setRoomId: (roomId: string) => void;
  defaultDate?: Date;
}) {
  const t = useTranslations('task.creation');

  const { data: rooms } = useRooms({ hotelId });

  const roomNumbers: TRoomNumber[] =
    rooms?.map(({ id, number }) => ({ id, number })) ?? [];

  const preSelectedRoom = roomNumbers.find(({ id }) => id === roomId);

  const getDefaultCleaners = (roomId?: string) =>
    rooms
      ?.find(({ id }) => id === roomId)
      ?.defaultCleaners.map(({ id }) => id) ?? [];

  const parsedDefaultDate = defaultDate
    ? fromDate(defaultDate, getLocalTimeZone()).set({ hour: 11, minute: 0 })
    : now(getLocalTimeZone()).add({ days: 1 }).set({ hour: 11, minute: 0 });

  return (
    <Form className="flex flex-col gap-4" id={form} onSubmit={submitHandler}>
      {/* Room Number */}
      <Autocomplete
        isRequired
        defaultInputValue={preSelectedRoom?.number}
        defaultItems={roomNumbers}
        errorMessage={t('inputs.room_number.error_message')}
        label={t('inputs.room_number.label')}
        name="number"
        placeholder={t('inputs.room_number.placeholder')}
        variant="bordered"
        onSelectionChange={(id) => setRoomId(id ? id.toString() : '')}
      >
        {({ number, id }) => (
          <AutocompleteItem key={id}>{number}</AutocompleteItem>
        )}
      </Autocomplete>
      {/* Cleaners Selection */}
      <Select
        fullWidth
        isRequired
        defaultSelectedKeys={getDefaultCleaners(roomId)}
        errorMessage={t('inputs.cleaners.error_message')}
        form={form}
        isDisabled={cleaners.length === 0}
        label={t('inputs.cleaners.label')}
        name="cleaners"
        placeholder={t('inputs.cleaners.placeholder')}
        selectionMode="multiple"
      >
        {cleaners.map(({ user }) => (
          <SelectItem key={user.id}>{user.name}</SelectItem>
        ))}
      </Select>

      {cleaners.length === 0 && (
        <p className="text-sm text-danger">
          {t('no_cleaners', {
            default: 'No cleaners available. Please add cleaners first.',
          })}
        </p>
      )}

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          isRequired
          defaultValue={parsedDefaultDate}
          description={t('inputs.due_date.description')}
          errorMessage={t('inputs.due_date.error_message')}
          form={form}
          label={t('inputs.due_date.label', {
            default: 'Due Date',
          })}
          minValue={today(getLocalTimeZone())}
          name="dueAt"
        />
        {/* Priority */}
        <Select
          defaultSelectedKeys={[TaskPriority.MEDIUM]}
          description={t('inputs.priority.description')}
          form={form}
          label={t('inputs.priority.label')}
          name="priority"
          placeholder={t('inputs.priority.placeholder')}
        >
          {Object.values(TaskPriority).map((priority) => (
            <SelectItem key={priority}>
              {t(`inputs.priority.options.${priority}`)}
            </SelectItem>
          ))}
        </Select>
      </div>
    </Form>
  );
}
