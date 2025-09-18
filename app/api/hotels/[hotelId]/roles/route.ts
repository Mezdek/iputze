import { GeneralErrors, HttpStatus, RolesErrors } from "@constants";
import { canCreateRole, canViewRoles, getHotelOrThrow, getUserOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import type { RoleCollectionParams, TGetRolesResponse } from "@lib/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canViewRoles({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);

        const allRolesInHotel = await prisma.role.findMany({
            where: { hotelId },
            include: { user: { select: { name: true, avatarUrl: true, createdAt: true, email: true, notes: true, id: true, updatedAt: true } } }
        });

        const rolesEnhanced = allRolesInHotel.map<TGetRolesResponse>
            (
                ({ id, user: { name, id: userId, email, avatarUrl, notes, createdAt, updatedAt }, hotelId, level, status }) =>
                    ({ id, userId, hotelId, name, level, status, email, avatarUrl, notes, createdAt, updatedAt })
            )

        return NextResponse.json(rolesEnhanced);
    }
)

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles, id } = await getUserOrThrow(req);

        // To-Do fix error naming
        if (!canCreateRole({ roles, hotelId })) throw APP_ERRORS.forbidden(RolesErrors.ROLE_ALREADY_EXISTS);

        const role = await prisma.role.create({ data: { hotelId, userId: id } })

        return NextResponse.json(role, { status: HttpStatus.CREATED });
    }
)