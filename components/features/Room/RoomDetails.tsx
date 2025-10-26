'use client';
import { AssignmentCreation, Room } from '@components';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardProps,
  Divider,
} from '@heroui/react';
import type { User } from '@prisma/client';
import { AssignmentStatus, RoomCleanliness } from '@prisma/client';

import type { RoomWithHotel, TAssignmentResponse } from '@/types';

interface RoomDetailsCardProps {
  room: RoomWithHotel;
  tasks: TAssignmentResponse[];
  defaultCleaners: {
    user: User;
  }[];
}

export function RoomDetails({
  room,
  tasks,
  defaultCleaners,
  ...props
}: RoomDetailsCardProps & CardProps) {
  const taskInProgress = tasks.find(
    ({ status }) => status === AssignmentStatus.IN_PROGRESS
  );

  const taskPending = tasks.find(
    ({ status }) => status === AssignmentStatus.PENDING
  );

  const roomIsDirty = room.cleanliness === RoomCleanliness.DIRTY;
  const { className, ...rest } = props;
  return (
    <Card className={`w-full ${className}`} {...rest}>
      <CardHeader className="flex flex-col items-start gap-2">
        <h2 className="text-xl font-bold">Room {room.number}</h2>
      </CardHeader>
      <Room.StatusBar room={room} tasks={tasks} />
      <Divider />

      <CardBody className="gap-4">
        <Room.RoomInfo room={room} />

        <Divider />

        {(taskInProgress || taskPending) && (
          <Room.TasksOverview
            defaultCleaners={defaultCleaners}
            task={(taskInProgress || taskPending)!}
          />
        )}
      </CardBody>

      <CardFooter className="flex flex-col gap-2">
        {roomIsDirty && (
          <AssignmentCreation hotelId={room.hotelId} roomId={room.id} />
        )}
      </CardFooter>
    </Card>
  );
}
