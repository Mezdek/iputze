import { AssignmentStatus, RoleLevel, RoleStatus, RoomCleanliness, RoomOccupancy } from "@prisma/client";

/* -----------------------------------
   Route Params
----------------------------------- */
export type HotelParams = { hotelId: string };
// Rooms
export type RoomCollectionParams = HotelParams;
export type RoomParams = RoomCollectionParams & { roomId: string };
// Roles
export type RoleCollectionParams = HotelParams;
export type RoleParams = RoleCollectionParams & { roleId: string };
// Assignments
export type AssignmentCollectionParams = HotelParams;
export type AssignmentParams = AssignmentCollectionParams & { assignmentId: string };
// AssignmentNotes
export type AssignmentNoteCollectionParams = AssignmentParams;
export type AssignmentNoteParams = AssignmentNoteCollectionParams & { assignmentNoteId: string };

/* -----------------------------------
   Request Bodies
----------------------------------- */

// Hotels
export interface CreateHotelBody {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
}

// Rooms
export interface CreateRoomBody {
    number: string;
    occupancy?: RoomOccupancy;
    cleanliness?: RoomCleanliness;
}

// Assignments
export interface CreateAssignmentBody {
    roomId: number;
    roomNumber: string;
    dueAt: Date;
    notes?: string;
}

export interface UpdateAssignmentBody {
    notes?: string;
    isActive?: boolean;
    status?: AssignmentStatus;
}
// AssignmentNotes
export interface CreateAssignmentNoteBody {
    content: string
};
export interface UpdateAssignmentNoteBody {
    content: string
};
// Roles
export interface CreateRoleBody {
    hotelId: string
}
export interface UpdateRoleBody {
    level?: RoleLevel;
    status?: RoleStatus;
}

