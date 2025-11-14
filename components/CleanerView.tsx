'use client';

import { HotelBanner, TasksView } from '@components';
import { useTasks } from '@hooks';

import type { HotelViewProps } from '@/app/hotels/[hotelId]/page';

export function CleanerView({ user, hotelId }: HotelViewProps) {
  const { data: tasks } = useTasks({ hotelId });
  const role = user.roles.find((r) => r.hotel.id === hotelId);
  if (!role) return null;
  return (
    <div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
      <HotelBanner hotelName={role.hotel.name} />
      <TasksView taskListClassName="md:grid md:grid-cols-3" tasks={tasks} />
    </div>
  );
}
