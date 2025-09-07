import { RoleCollectionParams } from "@/types";
import { GeneralErrors, HttpStatus, RolesErrors } from "@constants";
import { canCreateRole, canViewRoles, getAuthContext, getHotelOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles } = await getAuthContext(req);

        if (!canViewRoles({ roles, hotelId })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);

        const allRolesInHotel = await prisma.role.findMany({
            where: { hotelId },
            include: { hotel: { select: { name: true } }, user: { select: { name: true } } }
        });

        return NextResponse.json(allRolesInHotel);
    }
)

export const POST = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleCollectionParams }) => {

        const { id: hotelId } = await getHotelOrThrow(params.hotelId);

        const { roles, id } = await getAuthContext(req);

        // To-Do fix error naming
        if (!canCreateRole({ roles, hotelId })) throw APP_ERRORS.forbidden(RolesErrors.ROLE_ALREADY_EXISTS);

        const role = await prisma.role.create({ data: { hotelId, userId: id } })

        return NextResponse.json(role, { status: HttpStatus.CREATED });
    }
)