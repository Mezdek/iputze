import type { HotelCreationBody, PublicHotel } from "@apptypes";
import { HotelErrors, HttpStatus } from "@constants";
import { APP_ERRORS, withErrorHandling } from "@errors";
import { canCreateHotel, getUserOrThrow } from "@helpers";
import { prisma } from "@lib/prisma";
import { Hotel } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest) => {
        const { roles } = await getUserOrThrow(req);
        const hotels = await prisma.hotel.findMany({
            include: { _count: true }
        });
        if (hotels.length === 0) throw APP_ERRORS.notFound(HotelErrors.EMPTY);

        const publicHotelList: PublicHotel[] = hotels.map(
            ({ id, name, address, description, email, phone }) => ({ id, name, address, description, email, phone })
        );
        return NextResponse.json<PublicHotel[]>(publicHotelList);
    }
)
export const POST = withErrorHandling(
    async (req: NextRequest) => {
        const { roles } = await getUserOrThrow(req);
        if (!canCreateHotel({ roles })) throw APP_ERRORS.forbidden();
        const data = (await req.json()) as HotelCreationBody;
        const hotelName = data.name;
        if (!hotelName) throw APP_ERRORS.badRequest(HotelErrors.MISSING_NAME);
        const exist = await prisma.hotel.findUnique({ where: { name: hotelName } });
        if (exist) throw APP_ERRORS.conflict(HotelErrors.DUPLICATED_NAME)
        const newHotel = await prisma.hotel.create({ data });
        return NextResponse.json<Hotel>(newHotel, { status: HttpStatus.CREATED });
    }
)