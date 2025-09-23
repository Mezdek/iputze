import type { EnhancedRole, RoleCollectionParams } from "@/types";
import { APP_ERRORS, canCreateRole, canViewRoles, GeneralErrors, getHotelOrThrow, getUserOrThrow, HttpStatus, RolesErrors, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import type { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getUserOrThrow(req);

        if (!canViewRoles({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

        const allRolesInHotel = await prisma.role.findMany({
            where: { hotelId },
            include: { user: { select: { name: true, avatarUrl: true, createdAt: true, email: true, notes: true, id: true, updatedAt: true } } }
        });

        const rolesEnhanced = allRolesInHotel.map<EnhancedRole>
            (
                ({ id, user: { name, id: userId, email, avatarUrl, notes, createdAt, updatedAt }, hotelId, level, status }) =>
                    ({ id, userId, hotelId, name, level, status, email, avatarUrl, notes, createdAt, updatedAt })
            )

        return NextResponse.json<EnhancedRole[]>(rolesEnhanced);
    }
)

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles, id } = await getUserOrThrow(req);

        if (!canCreateRole({ roles, hotelId })) throw APP_ERRORS.forbidden(RolesErrors.DUPLICATED);

        const role = await prisma.role.create({ data: { hotelId, userId: id } })

        return NextResponse.json<Role>(role, { status: HttpStatus.CREATED });
    }
)