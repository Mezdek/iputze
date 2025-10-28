import type { Hotel, Role, RoleLevel, RoleStatus } from '@prisma/client';

import type { HotelParams, SafeUser } from '@/types';

export type TRoleWithUser = Omit<Role, 'userId'> & { user: SafeUser };

export interface RoleUpdateBody {
  level?: RoleLevel;
  status?: RoleStatus;
}

export type TRole = Omit<Role, 'userId' | 'hotelId'> & { hotel: Hotel };

export type RoleCollectionParams = HotelParams;
export type RoleParams = RoleCollectionParams & { roleId: string };
