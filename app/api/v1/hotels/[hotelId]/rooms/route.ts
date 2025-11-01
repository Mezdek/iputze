import { getHotelOrThrow, getUserOrThrow, prisma } from '@lib/db';
import { canCreateRoom, canListRooms } from '@lib/server';
import {
  APP_ERRORS,
  HttpStatus,
  roomCreationSchema,
  RoomErrors,
  withErrorHandling,
} from '@lib/shared';
import type { Room } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { RoomCollectionParams, RoomWithHotel } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {
    const { hotelId: hotelIdFromParams } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdFromParams);

    const { roles } = await getUserOrThrow(req);

    if (!canListRooms({ roles, hotelId })) throw APP_ERRORS.forbidden();

    const rooms = await prisma.room.findMany({
      where: { hotelId },
      include: { hotel: true },
    });

    return NextResponse.json<RoomWithHotel[]>(rooms);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {
    const { hotelId: hotelIdFromParams } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdFromParams);

    const { roles } = await getUserOrThrow(req);

    if (!canCreateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();

    const data = roomCreationSchema.parse(await req.json());

    // Ensure room number is unique for this hotel
    const existingRoom = await prisma.room.findUnique({
      where: { hotelId_number: { hotelId, number: data.number } },
    });

    if (existingRoom) throw APP_ERRORS.badRequest(RoomErrors.DUPLICATED_NUMBER);

    const newRoom = await prisma.room.create({
      data: { ...data, hotelId },
    });

    return NextResponse.json<Room>(newRoom, { status: HttpStatus.CREATED });
  }
);
