import { Assignment, AssignmentNote, AssignmentStatus, Hotel, User as PrismaType_User, Role, RoleLevel, RoleStatus, Room, RoomCleanliness, RoomOccupancy } from "@prisma/client";


// Prisma types re-exported
export type { PrismaType_User };


// Utilities
export type SafeUser = Omit<PrismaType_User, "passwordHash">;

export type SafeUserWithRoles = SafeUser & { roles: Role[] };

export type TRole = Omit<Role, "userId" | "hotelId"> & { hotel: Hotel };

export type PublicHotel = Omit<Hotel, "createdAt" | "updatedAt">

export interface AssignmentAccessContext {
    hotelId: string;
    assignmentId: string;
    userId: string;
    assignment: Assignment,
    roles: Role[],
    isAdmin: boolean,
    isHotelManager: boolean,
    isAssignmentCleaner: boolean;
};



// Assignments

export interface AssignmentResponse extends Assignment {
    room: Room;
    AssignmentNote: AssignmentNote[];
    assignedByUser: SafeUser | null,
    cleaners: SafeUser[]
};

export interface AssignmentCreationBody {
    roomId: string;
    dueAt: Date;
    cleaners: string[]
}

export interface AssignmentUpdateBody {
    isActive?: boolean;
    status?: AssignmentStatus;
}


// AssignmentNotes
export interface AssignmentNoteCreationBody {
    content: string
};
export interface AssignmentNoteUpdateBody {
    content: string
};


// Auth
export interface SignInRequestBody {
    email: string;
    password: string;
}

export interface SignInResponse {
    user: { id: string; email: string; name: string; }; accessToken: string;
}

export interface SignUpRequestBody {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse { id: string; email: string; name: string };

export interface MeResponse extends SafeUser { roles: TRole[] }


// Hotels
export interface HotelCreationBody {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
}


// Roles
export interface EnhancedRole extends Role, SafeUser { }

export interface RoleUpdateBody {
    level?: RoleLevel;
    status?: RoleStatus;
}


// Rooms

interface RoomWithHotel extends Room { hotel: Hotel }

export interface RoomResponse extends Array<RoomWithHotel> { }

export interface RoomCreationBody {
    number: string;
    occupancy?: RoomOccupancy;
    cleanliness?: RoomCleanliness;
}

export interface RoomUpdateBody {
    number?: string;
    occupancy?: RoomOccupancy;
    cleanliness?: RoomCleanliness;
}
