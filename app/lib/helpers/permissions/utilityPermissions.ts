import { RoleLevel, RoleStatus, type Role } from "@prisma/client";

/**
 * Checks if the user has an active ADMIN role.
 *
 * @param {Role[]} params.roles - Roles of the acting user.
 * @returns {boolean} True if the user is an active admin, false otherwise.
 */
export const isAdmin = ({ roles }: { roles: Role[] }): boolean =>
    roles.some((r) => r.level === RoleLevel.ADMIN && r.status === RoleStatus.ACTIVE);



/**
 * Checks if the user has an active MANAGER role for a specific hotel.
 *
 * @param {Role[]} params.roles - Roles of the acting user.
 * @param {number} params.hotelId - Hotel ID to check the manager role for.
 * @returns {boolean} True if the user is an active manager of the hotel.
 */
export const isHotelManager = ({
    roles,
    hotelId,
}: {
    roles: Role[];
    hotelId: number;
}): boolean =>
    roles.some(
        (r) =>
            r.hotelId === hotelId && r.level === RoleLevel.MANAGER && r.status === RoleStatus.ACTIVE
    );


/**
* Checks if the user has an active MANAGER role for a specific hotel.
*
* @param {Role[]} params.roles - Roles of the acting user.
* @param {number} params.hotelId - Hotel ID to check the manager role for.
* @returns {boolean} True if the user is an active manager of the hotel.
*/
export const hasManagerPermission = ({
    roles,
    hotelId,
}: {
    roles: Role[];
    hotelId: number;
}): boolean =>
    isAdmin({ roles }) || isHotelManager({ roles, hotelId })




/**
 * Checks if the user has an active CLEANER role for a specific hotel.
 *
 * @param {Role[]} params.roles - Roles of the acting user.
 * @param {number} params.hotelId - Hotel ID to check the cleaner role for.
 * @returns {boolean} True if the user is an active cleaner of the hotel.
 */
export const isHotelCleaner = ({
    roles,
    hotelId,
}: {
    roles: Role[];
    hotelId: number;
}): boolean =>
    roles.some(
        (r) =>
            r.hotelId === hotelId && r.level === RoleLevel.CLEANER && r.status === RoleStatus.ACTIVE
    );



// /**
//  * Checks if a user is assigned to an assignment.
//  *
//  * @param {Object} params
//  * @param {AssignmentUserLink[]} params.assignmentUsers - Users assigned to the assignment.
//  * @param {number} params.userId - User ID to check.
//  * @returns {boolean} True if the user is assigned to the assignment.
//  */
// export const isAssignmentCleaner = ({
//     assignmentUsers,
//     userId,
// }: {
//     assignmentUsers: AssignmentUserLink[];
//     userId: number;
// }): boolean => assignmentUsers.some((au) => au.userId === userId);
