import { User as DB_USER, Hotel, Role, RoleLevel, RoleStatus } from "@prisma/client";


export type User = Omit<DB_USER, "passwordHash"> & { roles: Role[] };

export interface SignInRequestBody {
    email: string;
    password: string;
}

export interface SignInResponse {
    user: { id: number; email: string; name: string; }; accessToken: string;
}

export interface SignUpRequestBody {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse { id: number; email: string; name: string };

export type TRole = Omit<Role, "userId" | "hotelId"> & { hotel: Hotel };

export type TMeResponse = Omit<User, "roles"> & { roles: TRole[] }

export type TPublicHotelList = Omit<Hotel, "createdAt" | "updatedAt">[]

export type TGetRolesResponse = {
    id: number;
    userId: number;
    hotelId: number;
    name: string;
    level: RoleLevel;
    status: RoleStatus;
    email: string;
    avatarUrl: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}