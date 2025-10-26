import { getHotelOrThrow, getUserOrThrow, prisma } from '@lib/db';
import { canCreateRole, canViewRoles } from '@lib/server';
import {
  APP_ERRORS,
  GeneralErrors,
  HttpStatus,
  RolesErrors,
  withErrorHandling,
} from '@lib/shared';
import type { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { RoleCollectionParams, TRoleWithUser } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {
    const { hotelId: hotelIdParam } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);

    const { roles } = await getUserOrThrow(req);

    if (!canViewRoles({ roles, hotelId }))
      throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

    const rolesWithUser = await prisma.role.findMany({
      where: { hotelId },
      omit: { userId: true },
      include: {
        user: {
          omit: {
            passwordHash: true,
          },
        },
      },
    });

    return NextResponse.json<TRoleWithUser[]>(rolesWithUser);
  }
);

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {
    const { hotelId: hotelIdParam } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);

    const { roles, id } = await getUserOrThrow(req);

    if (!canCreateRole({ roles, hotelId }))
      throw APP_ERRORS.forbidden(RolesErrors.DUPLICATED);

    const role = await prisma.role.create({ data: { hotelId, userId: id } });

    return NextResponse.json<Role>(role, { status: HttpStatus.CREATED });
  }
);
