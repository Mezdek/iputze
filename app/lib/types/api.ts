import { User as DB_USER, Hotel, Role } from "@prisma/client";


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

export type TRoleWithHotel = Omit<Role, "userId" | "hotelId"> & { hotel: Hotel };

export type TMeResponse = Omit<User, "roles"> & { roles: TRoleWithHotel[] }

export type TPublicHotelList = Omit<Hotel, "createdAt" | "updatedAt">[]
