import { isAdmin, isHotelCleaner, isHotelManager } from '@/lib/helpers';
import type { RoomManagement } from '@/types';

/**
 * Check if the actor can create a room in a specific hotel.
 * Admins or managers of that hotel are allowed.
 *
 * @param {RoomManagement} params - Roles of the actor and target hotel ID.
 * @returns {boolean} True if creation is allowed, false otherwise.
 */
export const canCreateRoom = ({ roles, hotelId }: RoomManagement): boolean =>
  isAdmin({ roles }) || isHotelManager({ roles, hotelId });

/**
 * Check if the actor can update a room in a specific hotel.
 * Admins or managers of that hotel are allowed.
 *
 * @param {RoomManagement} params - Roles of the actor and target hotel ID.
 * @returns {boolean} True if update is allowed, false otherwise.
 */
export const canUpdateRoom = ({ roles, hotelId }: RoomManagement): boolean =>
  isAdmin({ roles }) || isHotelManager({ roles, hotelId });

/**
 * Check if the actor can delete a room in a specific hotel.
 * Admins or managers of that hotel are allowed.
 *
 * @param {RoomManagement} params - Roles of the actor and target hotel ID.
 * @returns {boolean} True if deletion is allowed, false otherwise.
 */
export const canDeleteRoom = ({ roles, hotelId }: RoomManagement): boolean =>
  isAdmin({ roles }) || isHotelManager({ roles, hotelId });

/**
 * Check if the actor can view a room in a specific hotel.
 * Admins, managers of that hotel, or cleaners assigned to that room are allowed.
 *
 * @param {RoomManagement} params - Roles of the actor and target hotel ID.
 * @returns {boolean} True if deletion is allowed, false otherwise.
 */
export const canViewRoom = ({ roles, hotelId }: RoomManagement): boolean =>
  isAdmin({ roles }) ||
  isHotelManager({ roles, hotelId }) ||
  isHotelCleaner({ roles, hotelId });
