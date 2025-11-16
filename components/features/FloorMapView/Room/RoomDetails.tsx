'use client';
import {
  RoomInfo,
  RoomUpdate,
  StatusBar,
  TaskCreation,
  TaskList,
} from '@components';
import { Card, CardBody, CardHeader, cn, Divider } from '@heroui/react';
import { RoomCleanliness, TaskStatus } from '@prisma/client';

import type { RoomDetailsCardProps } from '@/types';

export function RoomDetails({
  room,
  tasks,
  user,
  ...props
}: RoomDetailsCardProps) {
  const activeTasks = tasks.filter(
    (t) =>
      t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.PENDING
  );

  const roomIsDirty = room.cleanliness === RoomCleanliness.DIRTY;
  const { className, ...rest } = props;

  return (
    <Card className={cn('w-full', className)} {...rest}>
      <CardHeader className="flex flex-col items-start gap-2">
        <h2 className="text-xl font-bold">Room {room.number}</h2>
      </CardHeader>

      <StatusBar
        actions={<RoomUpdate isIconOnly room={room} />}
        room={room}
        tasks={tasks}
      />

      <Divider />

      <CardBody className="gap-4">
        <RoomInfo room={room} />

        <Divider />
        {roomIsDirty && (
          <TaskCreation hotelId={room.hotel.id} roomId={room.id} />
        )}
        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Active Tasks</h3>
            <TaskList
              emptyMessage="No active tasks"
              tasks={activeTasks}
              user={user}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
