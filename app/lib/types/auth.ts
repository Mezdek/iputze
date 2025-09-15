import type { Role } from "@prisma/client";

export type AuthContext = {
    id: number;
    name: string,
    email: string,
    avatarUrl?: string,
    roles: Role[];
};