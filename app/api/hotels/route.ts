import type { CreateHotelBody } from "@/lib/types";
import { GeneralErrors, HotelErrors, HttpStatus } from "@/lib/constants";
import { canCreateHotel, canListHotels, getAuthContext } from "@/lib/helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";



export const GET = withErrorHandling(
    async (req: NextRequest) => {
        const { roles } = await getAuthContext(req);
        if (!canListHotels({ roles })) throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);
        const hotels = await prisma.hotel.findMany({
            include: { _count: true }
        });
        if (hotels.length === 0) throw APP_ERRORS.notFound(HotelErrors.NO_HOTEL_FOUND);
        return NextResponse.json(hotels);
    }
)
export const POST = withErrorHandling(
    async (req: NextRequest) => {
        const { roles } = await getAuthContext(req);
        if (!canCreateHotel({ roles })) throw APP_ERRORS.forbidden();
        const data = (await req.json()) as CreateHotelBody;
        const hotelName = data.name;
        if (!hotelName) throw APP_ERRORS.badRequest(HotelErrors.HOTEL_NAME_REQUIRED);
        const exist = await prisma.hotel.findUnique({ where: { name: hotelName } });
        if (exist) throw APP_ERRORS.conflict(HotelErrors.HOTEL_NAME_EXISTS)
        const newHotel = await prisma.hotel.create({ data });
        return NextResponse.json(newHotel, { status: HttpStatus.CREATED });
    }
)