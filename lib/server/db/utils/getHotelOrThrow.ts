import { prisma } from '@/lib/server/db/prisma';
import { HotelErrors } from '@/lib/shared/constants/errors/hotels';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';

/**
 * Retrieves a hotel by ID and throws if not found or invalid.
 *
 * @param hotelIdParam - Raw hotelId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If hotelId is invalid or hotel not found.
 */
export const getHotelOrThrow = async (hotelId: string) => {
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

  if (!hotel) throw APP_ERRORS.badRequest(HotelErrors.NOT_FOUND);

  return hotel;
};
