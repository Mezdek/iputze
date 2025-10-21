import {
  APP_ERRORS,
  canCreateHotel,
  getUserOrThrow,
  HotelErrors,
  HttpStatus,
  withErrorHandling,
} from '@lib';
import { prisma } from '@lib/prisma';
import type { Hotel } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { HotelCreationBody, PublicHotel } from '@/types';

export const GET = withErrorHandling(async () => {
  const PublicHotelList = await prisma.hotel.findMany({
    omit: { updatedAt: true, createdAt: true, deletedAt: true },
  });
  if (PublicHotelList.length === 0)
    throw APP_ERRORS.notFound(HotelErrors.EMPTY);

  return NextResponse.json<PublicHotel[]>(PublicHotelList);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { roles } = await getUserOrThrow(req);
  if (!canCreateHotel({ roles })) throw APP_ERRORS.forbidden();
  const data = (await req.json()) as HotelCreationBody;
  const hotelName = data.name;
  if (!hotelName) throw APP_ERRORS.badRequest(HotelErrors.MISSING_NAME);
  const exist = await prisma.hotel.findUnique({ where: { name: hotelName } });
  if (exist) throw APP_ERRORS.conflict(HotelErrors.DUPLICATED_NAME);
  const newHotel = await prisma.hotel.create({ data });
  return NextResponse.json<Hotel>(newHotel, { status: HttpStatus.CREATED });
});
