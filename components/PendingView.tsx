'use client';

import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { useHotels } from '@hooks';

import type { HotelViewProps } from '@/app/hotels/[hotelId]/page';

export function PendingView({ hotelId }: HotelViewProps) {
  const { data: hotels } = useHotels();
  const hotel = hotels?.find((hotel) => hotel.id === hotelId);

  return (
    <div className="flex justify-center bg-background p-4">
      <Card className="max-w-md w-full h-fit bg-content1">
        <CardHeader className="flex flex-col gap-3 px-6 pt-6 pb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-default-100 text-3xl">
            ⏳
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Application Pending
          </h2>
        </CardHeader>

        <Divider />

        <CardBody className="px-6 py-5">
          <div className="flex flex-col gap-4 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-default-500 uppercase tracking-wide">
                Hotel
              </p>
              <p className="text-lg font-medium text-foreground">
                {hotel?.name}
              </p>
            </div>

            <p className="text-sm text-default-600 leading-relaxed">
              Your application is currently under review. You&apos;ll receive
              access once the hotel approves your request. Please contact the
              hotel directly for more information.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
