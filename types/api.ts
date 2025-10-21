import type {
  Assignment,
  AssignmentNote,
  AssignmentStatus,
  AssignmentUser,
  Hotel,
  Role,
  RoleLevel,
  RoleStatus,
  Room,
  RoomCleanliness,
  RoomOccupancy,
  User as PrismaType_User,
} from '@prisma/client';

// Prisma types re-exported
export type { PrismaType_User };

// Utilities
export type SafeUser = Omit<PrismaType_User, 'passwordHash'>;

export type SafeUserWithRoles = SafeUser & { roles: Role[] };

export type TRole = Omit<Role, 'userId' | 'hotelId'> & { hotel: Hotel };

export type PublicHotel = Omit<Hotel, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface AssignmentAccessContext {
  hotelId: string;
  assignmentId: string;
  userId: string;
  assignment: Assignment;
  roles: Role[];
  isAdmin: boolean;
  isHotelManager: boolean;
  isAssignmentCleaner: boolean;
}

// Assignments

export type TAssignmentResponse = Omit<
  Assignment,
  'assignedById' | 'roomId'
> & { room: Room } & { notes: Omit<AssignmentNote, 'assignmentId'>[] } & {
  assignedBy: SafeUser | null;
} & {
  cleaners: (Pick<AssignmentUser, 'assignedAt'> & SafeUser)[];
};

export interface AssignmentCreationBody {
  roomId: string;
  dueAt: Date;
  cleaners: string[];
}

export interface AssignmentUpdateBody {
  status?: AssignmentStatus;
}

// AssignmentNotes
export interface AssignmentNoteCreationBody {
  content: string;
}
export interface AssignmentNoteUpdateBody {
  content: string;
}

// Auth
export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: { id: string; email: string; name: string };
}

export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  name: string;
}

export interface MeResponse extends SafeUser {
  roles: TRole[];
}

// Hotels
export interface HotelCreationBody {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

// Roles
export type TRoleWithUser = Omit<Role, 'userId'> & { user: SafeUser };

export interface RoleUpdateBody {
  level?: RoleLevel;
  status?: RoleStatus;
}

// Rooms

export interface RoomWithHotel extends Room {
  hotel: Hotel;
}

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
