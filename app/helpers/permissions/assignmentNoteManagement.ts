import type {
    TAssignmentNoteCreation,
    TAssignmentNoteDeletion,
    TAssignmentNoteList,
    TAssignmentNoteUpdate,
} from "@/app/types/permissions";
import { isAdmin, isAssignmentCleaner, isHotelManager } from "@helpers/permissions/utilityPermissions";

/**
 * Determines whether a user can create an assignment note.
 *
 * Business rules:
 * - Admins can create any note.
 * - Managers can create notes for their hotel if the assignment is active.
 * - Assigned cleaners can create notes if the assignment is active.
 *
 * @param {TAssignmentNoteCreation} params - Actor roles, assignment status, hotel ID, assigned users, and user ID.
 * @returns {boolean} True if the user can create a note, false otherwise.
 */
export const canCreateAssignmentNote = ({
    roles,
    isActive,
    hotelId,
    assignmentUsers,
    userId,
}: TAssignmentNoteCreation): boolean => {
    if (isAdmin({ roles })) return true;
    if (!isActive) return false;
    return isHotelManager({ roles, hotelId }) || isAssignmentCleaner({ assignmentUsers, userId });
};

/**
 * Determines whether a user can update an assignment note.
 *
 * Business rules:
 * - Admins can update any note.
 * - Only the author of the note can update it if the assignment is active.
 *
 * @param {TAssignmentNoteUpdate} params - Actor roles, assignment status, user ID, and note author ID.
 * @returns {boolean} True if the user can update the note, false otherwise.
 */
export const canUpdateAssignmentNote = ({
    roles,
    isActive,
    userId,
    authorId,
}: TAssignmentNoteUpdate): boolean => {
    if (isAdmin({ roles })) return true;
    if (!isActive) return false;
    return userId === authorId;
};

/**
 * Determines whether a user can delete an assignment note.
 *
 * Business rules:
 * - Admins can delete any note.
 * - Note authors can delete their notes if the assignment is active.
 * - Managers can delete any note if the assignment is inactive.
 *
 * @param {TAssignmentNoteDeletion} params - Actor roles, assignment status, user ID, author ID, and hotel ID.
 * @returns {boolean} True if the user can delete the note, false otherwise.
 */
export const canDeleteAssignmentNote = ({
    roles,
    isActive,
    userId,
    authorId,
    hotelId,
}: TAssignmentNoteDeletion): boolean => {
    if (isAdmin({ roles })) return true;
    if (isActive) return userId === authorId;
    if (!hotelId) return false;
    return isHotelManager({ roles, hotelId });
};

/**
 * Determines whether a user can view assignment notes.
 *
 * Business rules:
 * - Admins can view any note.
 * - Managers can view notes for their hotel.
 * - Assigned cleaners can view notes for assignments they are assigned to.
 *
 * @param {TAssignmentNoteList} params - Actor roles, hotel ID, assigned users, and user ID.
 * @returns {boolean} True if the user can view the notes, false otherwise.
 */
export const canGetAssignmentNote = ({
    roles,
    hotelId,
    assignmentUsers,
    userId,
}: TAssignmentNoteList): boolean => {
    return isAdmin({ roles }) || isHotelManager({ roles, hotelId }) || isAssignmentCleaner({ assignmentUsers, userId });
};
