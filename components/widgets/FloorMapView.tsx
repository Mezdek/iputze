'use client';
import { Room, RoomDetails } from '@components';
import { Card } from '@heroui/react';
import { useAssignments, useRooms } from '@hooks';
import { groupByKey } from '@lib/shared';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import type { InjectedAuthProps, RoomWithHotel } from '@/types';

export function FloorMapView({
  user,
  room,
  setRoom,
}: InjectedAuthProps & {
  room: RoomWithHotel | undefined;
  setRoom: (room: RoomWithHotel | undefined) => void;
}) {
  const { hotelId } = useParams<{ hotelId: string }>();

  const { data: rooms } = useRooms({ hotelId });
  const { data: tasks } = useAssignments({ hotelId });

  const floors = rooms && groupByKey({ items: rooms, key: 'floor' });
  const floorsWithRoomStatus = useMemo(
    () =>
      floors?.map((floor) =>
        floor.map((room) => ({
          ...room,
          status: Room.roomStatus({
            room,
            tasks: tasks?.filter((task) => task.room.id === room.id),
          }),
        }))
      ),
    [floors, tasks]
  );
  return (
    <div className="grid grid-cols-7 gap-2 p-2 h-full">
      <Room.RoomsMap
        className="col-span-5 h-full"
        floors={floorsWithRoomStatus}
        setRoom={setRoom}
      />
      {room && user ? (
        <RoomDetails
          className="col-span-2"
          defaultCleaners={[]}
          room={room}
          tasks={
            tasks?.filter((task) => task.room.number === room.number) ?? []
          }
        />
      ) : (
        <Card className="flex h-full gap-2 p-2 justify-end col-span-2">
          <Room.RoomCreation hotelId={hotelId} />
          {tasks && <Room.TaskManagement className="" tasks={tasks} />}
        </Card>
      )}
    </div>
  );
}
