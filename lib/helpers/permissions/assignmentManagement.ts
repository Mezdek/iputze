import type { AdminRights, AssignmentManagement } from "@/types";
import { isAdmin, isHotelManager } from "@/lib/helpers";



/**
 * Determines whether the actor can create an assignment.
 * Admins or managers of the hotel may create assignments.
*/
export const canCreateAssignment = ({ roles, hotelId }: AssignmentManagement): boolean => {
    return isAdmin({ roles }) || isHotelManager({ roles, hotelId });
};



/**
 * Determines whether the actor can view/list assignments.
 * Admins, hotel managers, or assigned cleaners.
 */
export const canListAssignments = ({ roles, hotelId }: AssignmentManagement): boolean => {
    return isAdmin({ roles }) || isHotelManager({ roles, hotelId });
};


/**
 * Determines whether the actor can delete an assignment.
 * Only admins or hotel managers.
 */
export const canDeleteAssignment = ({ roles }: AdminRights): boolean => isAdmin({ roles });