import type { Role, User } from '@prisma/client';

import type { TRole } from '@/types';

export type SafeUser = Omit<User, 'passwordHash'>;

export type SafeUserWithRoles = SafeUser & { roles: Role[] };

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
