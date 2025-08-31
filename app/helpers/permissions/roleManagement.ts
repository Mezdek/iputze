import type { TRoleList, TRoleModification } from "@/app/types/permissions";
import { isAdmin, isHotelManager } from "@helpers/permissions/utilityPermissions";

/**
 * Determines whether the actor can modify a specific role.
 *
 * Business rules:
 * - Admins can modify any role.
 * - Managers can only:
 *   - Approve PENDING → CLEANER roles in their hotel.
 *   - Enable or disable CLEANER roles in their hotel (without changing the level).
 *
 * @param {TRoleModification} params - Actor roles, target role, and intended changes.
 * @returns {boolean} True if modification is allowed, false otherwise.
 */
export const canModifyRole = ({
    roles,
    targetRole,
    newLevel,
    newStatus,
}: TRoleModification): boolean => {
    if (isAdmin({ roles })) return true;

    if (!isHotelManager({ roles, hotelId: targetRole.hotelId })) return false;

    // Approve PENDING → CLEANER
    if (targetRole.level === "PENDING" && newLevel === "CLEANER") return true;

    // Change CLEANER status (disable or re-activate)
    if (
        targetRole.level === "CLEANER" &&
        !newLevel && // level unchanged
        (newStatus === "DISABLED" || newStatus === "ACTIVE")
    ) return true;

    return false;
};

/**
 * Determines whether the actor can read roles of a specific hotel.
 *
 * Business rules:
 * - Admins can read all roles.
 * - Managers can read roles only in hotels they manage.
 *
 * @param {TRoleList} params - Actor roles and target hotel ID.
 * @returns {boolean} True if the actor can read roles, false otherwise.
 */
export const canViewRoles = ({ roles, hotelId }: TRoleList): boolean =>
    isAdmin({ roles }) || isHotelManager({ roles, hotelId });
