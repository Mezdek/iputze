import type { Cleaner, Role } from '@prisma/client';

import type { TaskUpdateBody } from '@/types/api';

export interface TaskManagement {
  roles: Role[];
  hotelId?: string;
  cleaners?: Cleaner[];
  updateData?: TaskUpdateBody;
}
