'use client';
import {
  DatePicker,
  Form,
  Input,
  Select,
  SelectItem,
  TimeInput,
} from '@heroui/react';
import { getLocalTimeZone, now, today } from '@internationalized/date';
import { TaskPriority } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { type FormEvent } from 'react';

import type { DefaultCleaner, TRoleWithUser } from '@/types';

export default function TaskForm({
  form,
  cleaners,
  submitHandler,
  roomNumber,
  defaultCleaners,
}: {
  form: string;
  cleaners: TRoleWithUser[];
  defaultCleaners?: DefaultCleaner[];
  submitHandler: (event: FormEvent<HTMLFormElement>) => void;
  roomNumber?: string;
}) {
  const t = useTranslations('task.creation');

  return (
    <Form className="flex flex-col gap-4" id={form} onSubmit={submitHandler}>
      {/* Room Number */}
      <Input
        required
        defaultValue={roomNumber}
        errorMessage={t('inputs.room_number.error_message')}
        label={t('inputs.room_number.label')}
        name="number"
        placeholder={t('inputs.room_number.placeholder')}
        variant="bordered"
      />
      {/* Cleaners Selection */}
      <Select
        fullWidth
        isRequired
        defaultSelectedKeys={
          defaultCleaners ? defaultCleaners.map(({ id }) => id) : []
        }
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
          defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
          description={t('inputs.due_date.description')}
          errorMessage={t('inputs.due_date.error_message')}
          form={form}
          label={t('inputs.due_date.label', {
            default: 'Due Date',
          })}
          minValue={today(getLocalTimeZone())}
          name="dueAt"
        />

        <TimeInput
          defaultValue={now(getLocalTimeZone()).set({ hour: 11 })}
          description={t('inputs.due_time.description', {
            default: 'Select time',
          })}
          form={form}
          hourCycle={24}
          label={t('inputs.due_time.label', {
            default: 'Due Time',
          })}
          name="dueTime"
        />
      </div>

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
    </Form>
  );
}
