import type { RoleManagement, RoleManagementModification } from "@/types";
import { isAdmin, isHotelManager } from "@helpers";
import { RoleLevel, RoleStatus } from "@prisma/client";

/**
 * Determines whether the actor can modify a specific role.
 *
 * Business rules:
 * - Admins can modify any role.
 * - Managers can only:
 *   - Approve a role changing from PENDING → CLEANER in their hotel.
 *   - Change the status (ACTIVE or DISABLED) of existing CLEANER roles in their hotel,
 *     but cannot change the level.
 *
 * @param {RoleManagementModification} params - The actor's roles, target role, and intended changes.
 * @param {Array<Role>} params.roles - The roles of the acting user.
 * @param {Role} params.targetRole - The role being modified.
 * @param {RoleLevel} [params.newLevel] - The new role level, if being changed.
 * @param {RoleStatus} [params.newStatus] - The new role status, if being changed.
 * @returns {boolean} True if the modification is allowed, false otherwise.
 */
export const canModifyRole = ({
    roles,
    targetRole,
    newLevel,
    newStatus,
}: RoleManagementModification): boolean => {
    if (isAdmin({ roles })) return true;

    if (!isHotelManager({ roles, hotelId: targetRole.hotelId })) return false;

    // Approve PENDING → CLEANER
    if (targetRole.level === RoleLevel.PENDING && newLevel === RoleLevel.CLEANER) return true;

    // Change CLEANER status (disable or re-activate)
    if (
        targetRole.level === RoleLevel.CLEANER &&
        !newLevel && // level unchanged
        (newStatus === RoleStatus.DISABLED || newStatus === RoleStatus.ACTIVE)
    ) return true;

    return false;
};



/**
 * Determines whether the actor can read roles for a specific hotel.
 *
 * Business rules:
 * - Admins can read all roles across all hotels.
 * - Managers can read roles only in hotels they manage.
 *
 * @param {RoleManagement} params - The actor's roles and the target hotel ID.
 * @param {Array<Role>} params.roles - The roles of the acting user.
 * @param {string} params.hotelId - The target hotel ID to check.
 * @returns {boolean} True if the actor can view roles, false otherwise.
 */
export const canViewRoles = ({ roles, hotelId }: RoleManagement): boolean =>
    isAdmin({ roles }) || (!!hotelId && isHotelManager({ roles, hotelId }));



/**
 * Determines whether the actor can create a new role in a hotel.
 *
 * Business rules:
 * - A user can create a role for a hotel only if they do not already have
 *   a role assigned in that same hotel.
 *
 * @param {RoleManagement} params - The actor's roles and the target hotel ID.
 * @param {Array<Role>} params.roles - The roles of the acting user.
 * @param {string} params.hotelId - The target hotel ID for role creation.
 * @returns {boolean} True if the actor can create a new role, false otherwise.
 */
export const canCreateRole = ({ roles, hotelId }: RoleManagement): boolean =>
    !roles.some(r => r.hotelId === hotelId);
