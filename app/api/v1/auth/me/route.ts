import { getUserOrThrow, prisma } from '@lib/db';
import { getAdminRole, isAdmin } from '@lib/server';
import { HttpStatus, withErrorHandling } from '@lib/shared';
import type { Hotel, Role } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { MeResponse, TRole } from '@/types';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { roles, ...user } = await getUserOrThrow(req);
  const userIsAdmin = isAdmin({ roles });

  let hotels: Hotel[], rolesWithHotels: TRole[];

  if (userIsAdmin) {
    // An admin has control over all the hotels
    hotels = await prisma.hotel.findMany();
    // Extend the admin role to all hotels
    const {
      hotelId: _hotelId,
      userId: _userId,
      ...adminRole
    } = getAdminRole<Role>({ roles });

    rolesWithHotels = hotels.map((hotel) => ({
      ...adminRole,
      hotel,
    }));
  } else {
    const hotelIds = roles.map((r) => r.hotelId);
    hotels = await prisma.hotel.findMany({ where: { id: { in: hotelIds } } });
    rolesWithHotels = roles
      .map(({ userId: _userId, hotelId, ...role }) => {
        const hotel = hotels.find((hotel) => hotel.id === hotelId);

        if (!hotel) {
          console.warn(
            `Role ${role.id} references non-existent hotel ${hotelId}`
          );
          return null;
        }
        return {
          ...role,
          hotel,
        };
      })
      .filter((role): role is NonNullable<typeof role> => role !== null);
  }
  // Send the user informatin with all the roles they have
  return NextResponse.json<MeResponse>(
    { ...user, roles: rolesWithHotels },
    { status: HttpStatus.OK }
  );
});
