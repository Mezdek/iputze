import type { Hotel } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import {
  HotelErrors,
  HttpStatus,
  RATE_LIMIT_KEYS,
} from '@/lib/shared/constants';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import type { HotelCreationBody, PublicHotel } from '@/types';

export const GET = withErrorHandling(async (req: NextRequest) => {
  await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

  const PublicHotelList = await prisma.hotel.findMany({
    select: {
      address: true,
      description: true,
      email: true,
      id: true,
      name: true,
      phone: true,
    },
  });
  if (PublicHotelList.length === 0)
    throw APP_ERRORS.notFound(HotelErrors.EMPTY);

  return NextResponse.json<PublicHotel[]>(PublicHotelList);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { roles } = await getUserOrThrow(req);
  if (!checkPermission.creation.hotel({ roles })) throw APP_ERRORS.forbidden();
  const data = (await req.json()) as HotelCreationBody;
  const hotelName = data.name;
  if (!hotelName) throw APP_ERRORS.badRequest(HotelErrors.MISSING_NAME);
  const exist = await prisma.hotel.findUnique({ where: { name: hotelName } });
  if (exist) throw APP_ERRORS.conflict(HotelErrors.DUPLICATED_NAME);
  const newHotel = await prisma.hotel.create({ data });
  return NextResponse.json<Hotel>(newHotel, { status: HttpStatus.CREATED });
});
