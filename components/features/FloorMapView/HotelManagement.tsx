'use client';
import { RoomCreation } from '@components';
import { Card, CardBody, CardHeader, cn, Divider } from '@heroui/react';
import React from 'react';

import { useHotels } from '@/hooks';

export function HotelManagement({
  className,
  hotelId,
}: {
  className?: string;
  hotelId: string;
}) {
  const { data: hotels } = useHotels();
  const hotel = hotels?.find(({ id }) => id === hotelId);
  return (
    <Card className={cn('p-3', className)}>
      <CardHeader className="justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Hotel Management
        </h3>
        <RoomCreation isIconOnly hotelId={hotelId} />
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
        <Detail label="Name: " value={hotel?.name} />
        <Detail label="Description: " value={hotel?.description} />
        <Detail label="E-Mail: " value={hotel?.email} />
        <Detail label="Phone: " value={hotel?.phone} />
        <Detail label="Address: " value={hotel?.address} />
      </CardBody>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="shadow-medium p-3 rounded-md">
      <p className="font-bold">{label}</p>
      <Divider />
      <p className="pt-2">{value ?? ''}</p>
    </div>
  );
}
