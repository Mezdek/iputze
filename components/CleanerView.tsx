'use client';

import { HotelBanner, ListRenderer, TaskCard } from '@components';
import { useTasks } from '@hooks';
import { useParams } from 'next/navigation';

import type { InjectedAuthProps } from '@/types';

export function CleanerView({ user }: InjectedAuthProps) {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { data: tasks, isLoading } = useTasks({ hotelId });

  const role = user.roles.find((r) => r.hotel.id === hotelId);
  if (!role) return null;

  return (
    <div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
      <HotelBanner hotelName={role.hotel.name} />
      <ListRenderer data={tasks} isLoading={isLoading}>
        {(task) => (
          <TaskCard showImages key={task.id} task={task} user={user} />
        )}
      </ListRenderer>
    </div>
  );
}
