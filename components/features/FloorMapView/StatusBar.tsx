'use client';
import { Chip } from '@heroui/react';
import { RoomCleanliness, RoomOccupancy, TaskStatus } from '@prisma/client';
import type { ReactNode } from 'react';

import { ROOM_OCCUPANCY_COLORS } from '@/lib/shared/constants/features/room';
import { capitalize } from '@/lib/shared/utils/capitalize';
import type { RoomWithContext, TaskResponse } from '@/types';

const RoomOccupancyColors = {
  [RoomOccupancy.VACANT]: ROOM_OCCUPANCY_COLORS.VACANT,
  [RoomOccupancy.OCCUPIED]: ROOM_OCCUPANCY_COLORS.OCCUPIED,
  [RoomOccupancy.UNAVAILABLE]: ROOM_OCCUPANCY_COLORS.UNAVAILABLE,
  undefined: 'default',
} as const;

interface StatusBarProps {
  room: RoomWithContext;
  tasks: TaskResponse[];
  actions?: ReactNode;
}

export function StatusBar({ tasks, room, actions }: StatusBarProps) {
  return (
    <div className="flex justify-between w-full p-2">
      <div className="flex gap-2 flex-wrap">
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
      {actions && <div className="flex gap-2">{actions}</div>}
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
  room: RoomWithContext;
  tasks: TaskResponse[] | null | undefined;
}) => {
  const taskInProgress = tasks?.some(
    ({ status }) => status === TaskStatus.IN_PROGRESS
  );

  const taskPending = tasks?.some(
    ({ status }) => status === TaskStatus.PENDING
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
