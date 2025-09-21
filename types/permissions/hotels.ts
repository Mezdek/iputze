import type { Role } from "@prisma/client";

export interface HotelManagement { roles: Role[], hotelId: string }
