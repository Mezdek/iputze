import { HotelErrors } from "@/lib/constants";
import { parseId } from "@/lib/helpers";
import { APP_ERRORS, prisma } from "@lib";

/**
 * Retrieves a hotel by ID and throws if not found or invalid.
 *
 * @param hotelIdParam - Raw hotelId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If hotelId is invalid or hotel not found.
 */
export const getHotelOrThrow = async (hotelIdParam: string) => {
    const hotelId = parseId(hotelIdParam, HotelErrors.HOTEL_ID_NOT_VALID);

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) throw APP_ERRORS.badRequest(HotelErrors.HOTEL_NOT_FOUND);

    return hotel;
};