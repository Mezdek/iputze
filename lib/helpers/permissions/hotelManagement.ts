import { isAdmin, isHotelManager } from '@/lib/helpers';
import type { AdminRights, HotelManagement } from '@/types';

/**
 * Determines whether the actor can create a hotel.
 *
 * Business rule:
 * - Only admins can create hotels.
 *
 * @param {AdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can create a hotel, false otherwise.
 */
export const canCreateHotel = ({ roles }: AdminRights): boolean =>
  isAdmin({ roles });

/**
 * Determines whether the actor can update a hotel.
 *
 * Business rule:
 * - Only admins can update hotels.
 *
 * @param {AdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can update a hotel, false otherwise.
 */
export const canUpdateHotel = ({ roles }: AdminRights): boolean =>
  isAdmin({ roles });

/**
 * Determines whether the actor can delete a hotel.
 *
 * Business rule:
 * - Only admins can delete hotels.
 *
 * @param {AdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can delete a hotel, false otherwise.
 */
export const canDeleteHotel = ({ roles }: AdminRights): boolean =>
  isAdmin({ roles });

/**
 * Determines whether the actor can view the information of a hotel.
 *
 * Business rule:
 * - Only admins and hotel managers can view the information of a hotel.
 *
 * @param {HotelManagement} params - Actor roles.
 * @returns {boolean} True if the actor can view the information of a hotel, false otherwise.
 */
export const canViewHotel = ({ roles, hotelId }: HotelManagement): boolean =>
  isAdmin({ roles }) || isHotelManager({ roles, hotelId });

/**
 * Determines whether the actor can see all rooms a hotel.
 *
 * Business rule:
 * - Only admins and hotel managers can see all rooms in a hotel.
 *
 * @param {HotelManagement} params - Actor roles.
 * @returns {boolean} True if the actor can see all rooms in a hotel, false otherwise.
 */
export const canListRooms = ({ roles, hotelId }: HotelManagement): boolean =>
  isAdmin({ roles }) || isHotelManager({ roles, hotelId });
