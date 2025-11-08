import type { Room } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getRoomOrThrow } from '@/lib/server/db/utils/getRoomOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import {
  canDeleteRoom,
  canUpdateRoom,
  canViewRoom,
} from '@/lib/shared/utils/permissions';
import { roomUpdateSchema } from '@/lib/shared/validation/schemas';
import type { RoomParams } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomParams }) => {
    const { hotelId: hotelIdParam, roomId } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const room = await getRoomOrThrow(roomId, hotelId);
    const { roles } = await getUserOrThrow(req);

    if (!canViewRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();
    return NextResponse.json<Room>(room);
  }
);

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomParams }) => {
    const { hotelId: hotelIdParam, roomId } = await params;
    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const room = await getRoomOrThrow(roomId, hotelId);
    const { roles } = await getUserOrThrow(req);

    if (!canUpdateRoom({ roles, hotelId })) throw APP_ERRORS.forbidden();

    const data = roomUpdateSchema.parse(await req.json());
    const updatedRoom = await prisma.room.update({
      where: { id: room.id, hotelId },
      data,
    });
    return NextResponse.json<Room>(updatedRoom);
  }
);

export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoomParams }) => {
    const { hotelId: hotelIdParam, roomId } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);
    const room = await getRoomOrThrow(roomId, hotelId);
    const { roles } = await getUserOrThrow(req);
    if (!canDeleteRoom({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);
    await prisma.room.delete({ where: { id: room.id, hotelId } });
    return new Response(null, { status: HttpStatus.NO_CONTENT });
  }
);
