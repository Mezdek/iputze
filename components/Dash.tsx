import { Room, RoomDetails } from '@components';
import { Card } from '@heroui/react';
import { AssignmentStatus, RoomCleanliness } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useAssignments, useRooms } from '@/hooks';
import { groupByKey } from '@/lib';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@/temp/new template/components';
import type {
  InjectedAuthProps,
  RoomWithHotel,
  TAssignmentResponse,
} from '@/types';

export function Dash({ user }: InjectedAuthProps) {
  const { hotelId } = useParams<{ hotelId: string }>();

  const { data: rooms } = useRooms({ hotelId });
  const { data: tasks } = useAssignments({ hotelId });
  const [room, setRoom] = useState<RoomWithHotel>();

  const floors = rooms && groupByKey({ items: rooms, key: 'floor' });
  const floorsWithRoomStatus = floors?.map((floor) =>
    floor.map((room) => ({
      ...room,
      status: Room.roomStatus({
        room,
        tasks: tasks?.filter((task) => task.room.id === room.id),
      }),
    }))
  );
  return (
    <div className="grid grid-cols-7 gap-2 p-2 h-full">
      <Room.Nav
        className="col-span-5"
        goToOverview={() => setRoom(undefined)}
      />
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

export const getRoomAssignments = (
  assignments: TAssignmentResponse[] | undefined | null,
  roomId: string
) => {
  if (assignments === undefined || assignments === null) return [];
  return assignments.filter((assignment) => assignment.room.id === roomId);
};

export const getLastAssignment = (
  assignments: TAssignmentResponse[] | null | undefined
) => {
  if (
    assignments === undefined ||
    assignments === null ||
    assignments.length === 0
  )
    return undefined;
  const sorted = assignments.sort((b, a) => {
    const dateA = new Date(a.dueAt);
    const dateB = new Date(b.dueAt);
    return dateA.getTime() - dateB.getTime();
  });
  return sorted[0];
};

export const statusOptions = {
  clean: { color: 'success', icon: CheckCircleIcon, label: 'Clean' },
  dirty: { color: 'danger', icon: XCircleIcon, label: 'Dirty' },
  in_progress: {
    color: 'warning',
    icon: ExclamationTriangleIcon,
    label: 'In Progress',
  },
} as const;

type TStatusOptions = typeof statusOptions;
type KStatusOptions = keyof TStatusOptions;
type VStatusOptions = TStatusOptions[KStatusOptions];

export const getStatus = ({
  cleanliness,
  lastAssignment,
}: {
  cleanliness: RoomCleanliness;
  lastAssignment: TAssignmentResponse | undefined;
}): VStatusOptions => {
  const hasActiveAssignment =
    !!lastAssignment && lastAssignment.status !== AssignmentStatus.COMPLETED;
  if (cleanliness === RoomCleanliness.CLEAN) return statusOptions.clean;
  if (hasActiveAssignment) return statusOptions.in_progress;
  return statusOptions.dirty;
};
