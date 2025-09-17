import { HotelErrors, HttpStatus } from "@constants";
import { canCreateHotel, getUserOrThrow } from "@helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import type { CreateHotelBody, TPublicHotelList } from "@lib/types";
import { Hotel } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest) => {
        const { roles } = await getUserOrThrow(req);
        const hotels = await prisma.hotel.findMany({
            include: { _count: true }
        });
        if (hotels.length === 0) throw APP_ERRORS.notFound(HotelErrors.NO_HOTEL_FOUND);

        const publicHotelList: TPublicHotelList = hotels.map(({ id, name, address, description, email, phone }) => ({ id, name, address, description, email, phone }));
        return NextResponse.json<TPublicHotelList>(publicHotelList);
    }
)
export const POST = withErrorHandling(
    async (req: NextRequest) => {
        const { roles } = await getUserOrThrow(req);
        if (!canCreateHotel({ roles })) throw APP_ERRORS.forbidden();
        const data = (await req.json()) as CreateHotelBody;
        const hotelName = data.name;
        if (!hotelName) throw APP_ERRORS.badRequest(HotelErrors.HOTEL_NAME_REQUIRED);
        const exist = await prisma.hotel.findUnique({ where: { name: hotelName } });
        if (exist) throw APP_ERRORS.conflict(HotelErrors.HOTEL_NAME_EXISTS)
        const newHotel = await prisma.hotel.create({ data });
        return NextResponse.json<Hotel>(newHotel, { status: HttpStatus.CREATED });
    }
)