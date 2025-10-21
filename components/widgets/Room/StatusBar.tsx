'use client';
import { Room } from '@components';
import { Chip } from '@heroui/react';
import {
  AssignmentStatus,
  RoomCleanliness,
  RoomOccupancy,
} from '@prisma/client';

import { capitalize } from '@/lib';
import type { RoomWithHotel, TAssignmentResponse } from '@/types';

const RoomOccupancyColors = {
  [RoomOccupancy.VACANT]: 'success',
  [RoomOccupancy.OCCUPIED]: 'warning',
  [RoomOccupancy.UNAVAILABLE]: 'danger',
  undefined: 'default',
} as const;

export function StatusBar({
  tasks,
  room,
}: {
  room: RoomWithHotel;
  tasks: TAssignmentResponse[];
}) {
  return (
    <div className="flex justify-between w-full p-2">
      <div className="flex gap-2">
        <Chip
          className="h-full cursor-default"
          color={RoomOccupancyColors[room.occupancy]}
          variant="flat"
        >
          {capitalize(room.occupancy)}
        </Chip>
        <Chip
          className="h-full cursor-default"
          color={roomStatus({ room: room, tasks: tasks }).chip.color}
          variant="flat"
        >
          {
            roomStatus({
              room: room,
              tasks: tasks,
            }).chip.content
          }
        </Chip>
        {room.type && (
          <Chip
            className="h-full cursor-default"
            color="default"
            variant="flat"
          >
            {capitalize(room.type)}
          </Chip>
        )}
      </div>
      <Room.RoomUpdate isIconOnly room={room} />
    </div>
  );
}

type TContent =
  | 'Clean'
  | 'Being cleaned'
  | 'Has been assigned'
  | 'Needs cleaning';
type TColor = 'warning' | 'danger' | 'success' | 'default';

export type TRoomStatus = {
  color: TColor;
  chip: { color: TColor; content: TContent };
};

export const roomStatus = ({
  room,
  tasks,
}: {
  room: RoomWithHotel;
  tasks: TAssignmentResponse[] | null | undefined;
}) => {
  const taskInProgress = tasks?.some(
    ({ status }) => status === AssignmentStatus.IN_PROGRESS
  );

  const taskPending = tasks?.some(
    ({ status }) => status === AssignmentStatus.PENDING
  );

  const roomStatus: TRoomStatus = {
    chip: {
      color: 'danger',
      content: 'Needs cleaning',
    },
    color: 'danger',
  };

  if (room.cleanliness === RoomCleanliness.CLEAN) {
    roomStatus.chip.content = 'Clean';
    roomStatus.chip.color = 'success';
  }
  if (taskInProgress) {
    roomStatus.chip.content = 'Being cleaned';
    roomStatus.chip.color = 'warning';
  }
  if (taskPending) {
    roomStatus.chip.content = 'Has been assigned';
    roomStatus.chip.color = 'warning';
  }
  roomStatus.color =
    room.occupancy === RoomOccupancy.UNAVAILABLE
      ? 'default'
      : roomStatus.chip.color;
  return roomStatus;
};
