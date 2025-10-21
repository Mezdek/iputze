import type { Role } from '@prisma/client';

export interface RoomManagement {
  roles: Role[];
  hotelId: string;
}
