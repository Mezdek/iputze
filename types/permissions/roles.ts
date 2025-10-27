import type { Role, RoleLevel, RoleStatus } from '@prisma/client';

export interface RoleManagementModification {
  roles: Role[];
  targetRole: Role;
  newLevel?: RoleLevel | undefined;
  newStatus?: RoleStatus | undefined;
}

export interface RoleManagement {
  roles: Role[];
  hotelId?: string;
}
