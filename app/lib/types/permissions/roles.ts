import type { Role, RoleLevel, RoleStatus } from "@prisma/client"

export interface RoleManagementModification {
    roles: Role[],
    targetRole: Role,
    newLevel?: RoleLevel,
    newStatus?: RoleStatus,
}

export interface RoleManagement { roles: Role[], hotelId?: string }