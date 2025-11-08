import { prisma } from '@/lib/server/db/prisma';
import { RolesErrors } from '@/lib/shared/constants/errors/roles';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';

export const getRoleOrThrow = async (
  roleId: string,
  expectedHotelId?: string
) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: { hotel: { select: { id: true } } },
  });

  if (!role) throw APP_ERRORS.notFound(RolesErrors.NOT_FOUND);

  if (expectedHotelId && role.hotel.id !== expectedHotelId)
    throw APP_ERRORS.badRequest(RolesErrors.NOT_IN_HOTEL);

  return role;
};
