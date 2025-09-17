import { HttpStatus } from "@constants";
import { getUserOrThrow, isAdmin } from "@helpers";
import { prisma, withErrorHandling } from "@lib";
import type { TMeResponse, TRole } from "@lib/types";
import type { Hotel } from "@prisma/client";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest) => {
        const user = await getUserOrThrow(req);
        const userIsAdmin = isAdmin({ roles: user.roles });

        let hotels: Hotel[], rolesWithHotels: TRole[];

        if (userIsAdmin) {
            hotels = await prisma.hotel.findMany();
            rolesWithHotels = hotels.map(
                hotel => ({ id: user.id, level: RoleLevel.ADMIN, status: RoleStatus.ACTIVE, hotel }))
        } else {
            const hotelIds = user.roles.map(r => r.hotelId);
            hotels = await prisma.hotel.findMany({ where: { id: { in: hotelIds } } });
            rolesWithHotels = user.roles.map(
                ({ id, hotelId, level, status }) => ({ id, level, status, hotel: { ...hotels.find(h => h.id === hotelId)! } }))
        }

        return NextResponse.json<TMeResponse>(
            { ...user, roles: rolesWithHotels },
            { status: HttpStatus.OK }
        );
    }
)
