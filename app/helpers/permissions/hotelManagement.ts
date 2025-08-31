import { TAdminRights, THotelManagement } from "@/app/types/permissions";
import { isAdmin, isHotelManager } from "@helpers/permissions/utilityPermissions";

/**
 * Determines whether the actor can create a hotel.
 *
 * Business rule:
 * - Only admins can create hotels.
 *
 * @param {TAdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can create a hotel, false otherwise.
 */
export const canCreateHotel = ({ roles }: TAdminRights): boolean =>
    isAdmin({ roles });

/**
 * Determines whether the actor can update a hotel.
 *
 * Business rule:
 * - Only admins can update hotels.
 *
 * @param {TAdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can update a hotel, false otherwise.
 */
export const canUpdateHotel = ({ roles }: TAdminRights): boolean =>
    isAdmin({ roles });

/**
 * Determines whether the actor can delete a hotel.
 *
 * Business rule:
 * - Only admins can delete hotels.
 *
 * @param {TAdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can delete a hotel, false otherwise.
 */
export const canDeleteHotel = ({ roles }: TAdminRights): boolean =>
    isAdmin({ roles });



/**
 * Determines whether the actor can see all rooms a hotel.
 *
 * Business rule:
 * - Only admins and hotel managers can see all rooms in a hotel.
 *
 * @param {THotelManagement} params - Actor roles.
 * @returns {boolean} True if the actor can see all rooms in a hotel, false otherwise.
 */
export const canListRooms = ({ roles, hotelId }: THotelManagement): boolean =>
    isAdmin({ roles }) || isHotelManager({ roles, hotelId });

/**
 * Determines whether the actor can see all hotels.
 *
 * Business rule:
 * - Only admins can see all hotels.
 *
 * @param {TAdminRights} params - Actor roles.
 * @returns {boolean} True if the actor can see all rooms in a hotel, false otherwise.
 */
export const canListHotels = ({ roles }: TAdminRights): boolean =>
    isAdmin({ roles });


/**
 * Determines whether the actor can view the information of a hotel.
 *
 * Business rule:
 * - Only admins and hotel managers can view the information of a hotel.
 *
 * @param {THotelManagement} params - Actor roles.
 * @returns {boolean} True if the actor can view the information of a hotel, false otherwise.
 */
export const canViewHotel = ({ roles, hotelId }: THotelManagement): boolean =>
    isAdmin({ roles }) || isHotelManager({ roles, hotelId });