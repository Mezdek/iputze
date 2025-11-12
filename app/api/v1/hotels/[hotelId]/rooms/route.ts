import type { Room } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { RoomErrors } from '@/lib/shared/constants/errors/rooms';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { roomSelect } from '@/lib/shared/constants/selects/room';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import { transformRoom } from '@/lib/shared/utils/transformers/transformRoom';
import { roomCreationSchema } from '@/lib/shared/validation/schemas';
import type { RoomCollectionParams, RoomWithContext } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {
    const { hotelId: hotelIdFromParams } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdFromParams);

    const { roles } = await getUserOrThrow(req);

    if (!checkPermission.view.hotel({ roles, hotelId }))
      throw APP_ERRORS.forbidden();

    const rooms = await prisma.room.findMany({
      where: { hotelId },
      select: roomSelect,
    });

    const transformedRoom = rooms.map(transformRoom);
    return NextResponse.json<RoomWithContext[]>(transformedRoom);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomCollectionParams }) => {
    const { hotelId: hotelIdFromParams } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdFromParams);

    const { roles } = await getUserOrThrow(req);

    if (!checkPermission.creation.room({ roles, hotelId }))
      throw APP_ERRORS.forbidden();

    const {
      defaultCleaners: defaultCleanersIds,
      capacity,
      ...data
    } = roomCreationSchema.parse(await req.json());

    const defaultCleaners =
      defaultCleanersIds && defaultCleanersIds.map((userId) => ({ userId }));

    console.log({ defaultCleaners });

    // Ensure room number is unique for this hotel
    const existingRoom = await prisma.room.findUnique({
      where: { hotelId_number: { hotelId, number: data.number } },
    });

    console.log({ existingRoom });
    if (existingRoom) throw APP_ERRORS.badRequest(RoomErrors.DUPLICATED_NUMBER);

    const newRoom = await prisma.room.create({
      data: {
        ...data,
        capacity: Number(capacity),
        hotelId,
        defaultCleaners: defaultCleaners
          ? { createMany: { data: defaultCleaners } }
          : undefined,
      },
    });

    return NextResponse.json<Room>(newRoom, { status: HttpStatus.CREATED });
  }
);
