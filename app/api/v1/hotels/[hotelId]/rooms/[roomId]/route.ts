import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getRoomOrThrow } from '@/lib/server/db/utils/getRoomOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import {
  GeneralErrors,
  HttpStatus,
  RoomErrors,
  roomSelect,
} from '@/lib/shared/constants';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import { transformRoom } from '@/lib/shared/utils/transformers/transformRoom';
import { roomUpdateSchema } from '@/lib/shared/validation/schemas';
import type { RoomParams, RoomWithContext } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomParams }) => {
    const { hotelId: hotelIdParam, roomId } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const room = await getRoomOrThrow(roomId);
    if (room.hotel.id !== hotelId)
      throw APP_ERRORS.badRequest(RoomErrors.NOT_IN_HOTEL);

    const { roles } = await getUserOrThrow(req);

    if (!checkPermission.view.room({ roles, hotelId }))
      throw APP_ERRORS.forbidden();
    return NextResponse.json<RoomWithContext>(room);
  }
);

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomParams }) => {
    const { hotelId: hotelIdParam, roomId } = await params;
    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const room = await getRoomOrThrow(roomId);

    if (room.hotel.id !== hotelId)
      throw APP_ERRORS.badRequest(RoomErrors.NOT_IN_HOTEL);

    const { roles } = await getUserOrThrow(req);

    if (!checkPermission.modification.room({ roles, hotelId }))
      throw APP_ERRORS.forbidden();

    const { defaultCleaners: defaultCleanersIds, ...data } =
      roomUpdateSchema.parse(await req.json());

    const defaultCleaners = defaultCleanersIds && {
      deleteMany: {},
      createMany: { data: defaultCleanersIds.map((userId) => ({ userId })) },
    };

    const updatedRoom = await prisma.room.update({
      where: { id: room.id, hotelId },
      data: {
        ...data,
        defaultCleaners,
      },
      select: roomSelect,
    });
    const transformedRoom = transformRoom(updatedRoom);

    return NextResponse.json<RoomWithContext>(transformedRoom);
  }
);

export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomParams }) => {
    const { hotelId: hotelIdParam, roomId } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const room = await getRoomOrThrow(roomId);

    if (room.hotel.id !== hotelId)
      throw APP_ERRORS.badRequest(RoomErrors.NOT_IN_HOTEL);

    const { roles } = await getUserOrThrow(req);

    if (!checkPermission.deletion.room({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    await prisma.room.delete({ where: { id: room.id, hotelId } });
    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
