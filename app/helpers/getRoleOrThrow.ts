import { RolesErrors } from "@constants";
import { parseId } from "@helpers";
import { APP_ERRORS, prisma } from "@lib";

export const getRoleOrThrow = async (roleIdParam: string, expectedHotelId?: number) => {


    const roleId = parseId(roleIdParam, RolesErrors.ROLE_ID_NOT_VALID);

    const role = await prisma.role.findUnique({ where: { id: roleId }, include: { hotel: { select: { id: true } } } });


    if (!role) throw APP_ERRORS.notFound(RolesErrors.ROLE_NOT_FOUND);

    if (expectedHotelId && role.hotel.id !== expectedHotelId) throw APP_ERRORS.badRequest(RolesErrors.ROLE_NOT_IN_HOTEL);

    return role;
};




