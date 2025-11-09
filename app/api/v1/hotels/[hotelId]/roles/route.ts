import type { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getHotelOrThrow } from '@/lib/server/db/utils/getHotelOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { RolesErrors } from '@/lib/shared/constants/errors/roles';
import { HttpStatus } from '@/lib/shared/constants/httpStatus';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import type { RoleCollectionParams, TRoleWithUser } from '@/types';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {
    const { hotelId: hotelIdParam } = await params;

    const { id: hotelId } = await getHotelOrThrow(hotelIdParam);

    const { roles } = await getUserOrThrow(req);

    if (!checkPermission.view.role({ roles, hotelId }))
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

    if (!checkPermission.creation.role({ roles, hotelId }))
      throw APP_ERRORS.forbidden(RolesErrors.DUPLICATED);

    const role = await prisma.role.create({ data: { hotelId, userId: id } });

    return NextResponse.json<Role>(role, { status: HttpStatus.CREATED });
  }
);
