'use client';
import type { TRoomStatus } from '@components';
import { Button, Card, CardBody, type CardProps, Divider } from '@heroui/react';

import type { RoomWithHotel } from '@/types';

export function RoomsMap({
  floors,
  setRoom,
  ...props
}: {
  floors: ({ status: TRoomStatus } & RoomWithHotel)[][] | null | undefined;
  setRoom: (props?: RoomWithHotel) => void;
} & CardProps) {
  const { className, ...rest } = props;
  return (
    <Card className={`gap-2 p-2 ${className}`} {...rest}>
      <CardBody className="flex gap-4">
        {floors?.map((floor, i, { length }) => (
          <Floor
            cLickHandler={setRoom}
            floor={floor}
            isLastFloor={i === length - 1}
            key={i}
          />
        ))}
      </CardBody>
    </Card>
  );
}

function Floor({
  floor,
  isLastFloor,
  cLickHandler,
}: {
  floor: ({ status: TRoomStatus } & RoomWithHotel)[];
  isLastFloor?: boolean;
  cLickHandler: (room?: { status: TRoomStatus } & RoomWithHotel) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-8 gap-5">
        {floor.map((room) => (
          <Button
            className="h-full min-h-25 rounded-none gap-0 p-0 text-3xl grid grid-cols-2"
            key={room.id}
            variant="bordered"
            onPress={() => cLickHandler(room)}
          >
            <p className="flex justify-center items-center w-full h-full">
              {room.number}
            </p>
            <div className={`w-full h-full bg-${room.status.color}`} />
          </Button>
        ))}
      </div>
      {!isLastFloor && <Divider />}
    </div>
  );
}
