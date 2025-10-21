import type { Roles, RoleStatus } from '@prisma/client';
import type { DefaultSession, DefaultUser } from 'next-auth';

// Extend the default JWT
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    roles?: {
      hotelId: number;
      role: Roles;
      status: RoleStatus;
    }[];
  }
}

// Extend the default session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      roles: Roles[]; // simple role list
      rolesDetailed: {
        hotelId: number;
        role: Roles;
        status: RoleStatus;
      }[];
      activeHotelIds: number[];
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    roles: {
      hotelId: number;
      role: Roles;
      status: RoleStatus;
    }[];
  }
}
