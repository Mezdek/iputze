import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getRoomOrThrow } from '@/lib/server/db/utils/getRoomOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { RoomErrors } from '@/lib/shared/constants/errors/rooms';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import {
  roomSelect,
  transformRoom,
} from '@/lib/shared/utils/transformers/transformRoom';
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

    const data = roomUpdateSchema.parse(await req.json());

    const updatedRoom = await prisma.room.update({
      where: { id: room.id, hotelId },
      data,
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

    if (!checkPermission.deleion.room({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    await prisma.room.delete({ where: { id: room.id, hotelId } });
    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
