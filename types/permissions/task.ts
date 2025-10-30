import type { Role } from '@prisma/client';

export interface TaskManagement {
  roles: Role[];
  hotelId: string;
}
