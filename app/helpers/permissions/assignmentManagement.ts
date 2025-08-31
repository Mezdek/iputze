import type { AssignmentUserLink } from "@/app/types/permissions";
import { isAdmin, isAssignmentCleaner, isHotelCleaner, isHotelManager } from "@helpers/permissions/utilityPermissions";
import type { Role } from "@prisma/client";

/** Basic assignment permissions context: roles + hotelId */
export type TAssignmentBasic = {
    roles: Role[];
    hotelId: number;
};

/** Context for updating an assignment */
export type TAssignmentUpdate = {
    roles: Role[];
    hotelId: number;
    assignmentUsers: AssignmentUserLink[];
    updatedFields?: string[];
    isActive: boolean
};

/** Context for listing assignments */
export type TAssignmentList = {
    roles: Role[];
    hotelId: number;
    assignmentUsers: AssignmentUserLink[];
};

/**
 * Determines whether the actor can create an assignment.
 * Admins or managers of the hotel may create assignments.
 */
export const canCreateAssignment = ({ roles, hotelId }: TAssignmentBasic): boolean => {
    if (hotelId === undefined) return false; // hotelId is required for managers
    return isAdmin({ roles }) || isHotelManager({ roles, hotelId });
};

/**
 * Determines whether the actor can update an assignment.
 * Admins/managers can update any fields except forbidden system fields.
 * Assigned cleaners can only update the "status" field.
 */
export const canUpdateAssignment = ({
    roles,
    hotelId,
    assignmentUsers,
    updatedFields,
    isActive
}: TAssignmentUpdate): boolean => {
    if (!isActive) return false;
    const userId = roles[0].userId;

    // Admins or managers
    if (isAdmin({ roles }) || isHotelManager({ roles, hotelId })) {
        const forbidden = new Set(["id", "createdAt", "updatedAt"]);
        return (updatedFields ?? []).every((f) => !forbidden.has(f));
    }

    // Assigned cleaners can only update "status"
    const isAssigned = isAssignmentCleaner({ assignmentUsers, userId });
    if (isAssigned) {
        return (updatedFields ?? []).every((f) => f === "status");
    }

    return false;
};

/**
 * Determines whether the actor can delete an assignment.
 * Only admins or hotel managers.
 */
export const canDeleteAssignment = ({ roles }: { roles: Role[] }): boolean => isAdmin({ roles });

/**
 * Determines whether the actor can view/list assignments.
 * Admins, hotel managers, or assigned cleaners.
 */
export const canListAssignment = ({ roles, hotelId, assignmentUsers }: TAssignmentList): boolean => {
    const userId = roles[0].userId;
    return isAdmin({ roles }) || isHotelManager({ roles, hotelId }) || isAssignmentCleaner({ assignmentUsers, userId });
};

/**
 * Determines whether the actor can assign users to an assignment.
 * Admins or hotel managers.
 */
export const canAssign = ({ roles, hotelId }: TAssignmentBasic): boolean =>
    isAdmin({ roles }) || isHotelManager({ roles, hotelId });

/**
 * Determines whether a user can be assigned to an assignment.
 * Only active cleaners in the hotel.
 */
export const canBeAssigned = ({ roles, hotelId }: TAssignmentBasic): boolean =>
    isHotelCleaner({ roles, hotelId });
