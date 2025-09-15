import type { Role } from "@prisma/client";

export interface AssignmentManagement {
    roles: Role[];
    hotelId: number;
};