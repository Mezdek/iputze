import { Role, RoleLevel, RoleStatus } from "@prisma/client";

/** Minimal user link for assignments (as stored on Assignment.users relation). */
export type AssignmentUserLink = { userId: number };

/** Common shape when a decision depends on assignment context. */
export interface AssignmentAccessBody {
    /** Hotel the assignment belongs to. Optional for cases where the caller may not provide it. */
    hotelId?: number;
    /** Users assigned to the assignment (optional for GET where it might not be loaded). */
    users?: AssignmentUserLink[];
    /** The currently authenticated user's id (actor). */
    userId: number;
}

/** Update payload for assignments: includes the actor context, plus arbitrary fields to update. */
export interface AssignmentUpdateBody extends AssignmentAccessBody {
    /** Computed by your genericCrudService; list of fields being updated. */
    updatedFields?: string[];
    /** Other fields intended for update; we don't validate shape here. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/** Delete payload for assignments: genericCrudService passes at least id, maybe hotelId. */
export interface AssignmentDeleteBody {
    assignmentId: number;
    hotelId?: number;
}

/** Read payload for assignments: may be *partial* filter (e.g. just hotelId). */
export type AssignmentGetBody = Partial<AssignmentUpdateBody>;

/** Note delete payload (managers/admins can delete any note; authors can delete their own). */
export interface NoteDeleteBody {
    hotelId?: number;
    authorId: number;
    userId: number;
}

/** Author-only note update payload. */
export interface NoteUpdateBody {
    authorId: number;
    userId: number;
}

/** 
 * Context object used when making permission decisions for rooms.
 * - `hotelId` is required because manager permissions are hotel-specific.
 * - `userId` is optional and may represent the currently authenticated user (actor).
 */
export interface RoomAccessBody {
    /** Hotel the room belongs to. Required for manager/admin checks. */
    hotelId: number;
    /** Optional: ID of the actor performing the action. */
    userId?: number;
}

////////////////////////////////////


export type TRoomManagement = { roles: Role[], hotelId: number }

export type TRoleModification = {
    roles: Role[],
    targetRole: Role,
    newLevel?: RoleLevel,
    newStatus?: RoleStatus,
}

export type TRoleList = { roles: Role[], hotelId: number }

export type TAdminRights = { roles: Role[] }

export type THotelManagement = { roles: Role[], hotelId: number }

export type TAssignmentNoteCreation = {
    roles: Role[],
    isActive: boolean;
    assignmentUsers: { userId: number }[];
    userId: number;
    hotelId: number;
}
export type TAssignmentNoteDeletion = {
    roles: Role[],
    userId: number,
    authorId: number,
    isActive: boolean,
    hotelId?: number
}
export type TAssignmentNoteList = {
    roles: Role[],
    hotelId: number,
    assignmentUsers: AssignmentUserLink[],
    userId: number
}
export type TAssignmentNoteUpdate = {
    roles: Role[],
    userId: number,
    authorId: number,
    isActive: boolean
}