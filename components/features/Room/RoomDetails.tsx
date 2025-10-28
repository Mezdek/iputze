'use client';
import {
  AssignmentCreation,
  AssignmentDetail,
  AssignmentList,
  RoomInfo,
  RoomUpdate,
} from '@components';
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
import { useState } from 'react';

import { StatusBar } from '@/components/shared';
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
  const [selectedAssignment, setSelectedAssignment] =
    useState<TAssignmentResponse | null>(null);

  const activeAssignments = tasks.filter(
    (t) =>
      t.status === AssignmentStatus.IN_PROGRESS ||
      t.status === AssignmentStatus.PENDING
  );

  const roomIsDirty = room.cleanliness === RoomCleanliness.DIRTY;
  const { className, ...rest } = props;

  return (
    <>
      <Card className={`w-full ${className}`} {...rest}>
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

          {/* Active Assignments */}
          {activeAssignments.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Active Assignments</h3>
              <AssignmentList
                assignments={activeAssignments}
                emptyMessage="No active assignments"
                onAssignmentClick={setSelectedAssignment}
              />
            </div>
          )}
        </CardBody>

        <CardFooter className="flex flex-col gap-2">
          {roomIsDirty && (
            <AssignmentCreation hotelId={room.hotelId} roomId={room.id} />
          )}
        </CardFooter>
      </Card>

      {/* Assignment Detail Modal */}
      <AssignmentDetail
        assignment={selectedAssignment}
        isOpen={!!selectedAssignment}
        viewMode="manager"
        onClose={() => setSelectedAssignment(null)}
      />
    </>
  );
}
