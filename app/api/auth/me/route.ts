import type { MeResponse, TRole } from "@apptypes";
import { getUserOrThrow, HttpStatus, isAdmin, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
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

        return NextResponse.json<MeResponse>(
            { ...user, roles: rolesWithHotels },
            { status: HttpStatus.OK }
        );
    }
)
