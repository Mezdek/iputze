'use client';
import { Avatar, Skeleton, Tooltip } from '@heroui/react';

import { useRoom } from '@/hooks';
import type { RoomWithContext } from '@/types';

export function RoomInfo({ room }: { room: RoomWithContext }) {
  const { data } = useRoom({ hotelId: room.hotel.id, roomId: room.id });
  if (!data) return <RoomInfoSkeleton />;
  const { floor, capacity, notes, defaultCleaners } = data;
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-semibold">Floor</p>
        <p>{floor ?? 'N/A'}</p>
      </div>
      <div>
        <p className="font-semibold">Capacity</p>
        <p>{capacity ?? 'N/A'} people</p>
      </div>
      <p className="text-default-600 col-span-2">
        {notes || 'No notes available'}
      </p>
      <div className="col-span-2 flex flex-col gap-1">
        <p className="font-semibold">Default Cleaners</p>
        <div className="flex gap-1">
          {defaultCleaners.map(({ id, name, avatarUrl }) => (
            <Tooltip content={name} key={id}>
              <Avatar
                className="flex-shrink-0"
                name={name}
                size="sm"
                src={avatarUrl ?? undefined}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomInfoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-semibold">Floor</p>
        <Skeleton className="w-12 h-5 rounded" />
      </div>
      <div>
        <p className="font-semibold">Capacity</p>
        <Skeleton className="w-20 h-5 rounded" />
      </div>
      <Skeleton className="col-span-2 h-5 w-3/4 rounded" />
      <div className="col-span-2 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" key={i} />
        ))}
      </div>
    </div>
  );
}
