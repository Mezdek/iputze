import type { Role } from '@prisma/client';

import type { TaskUpdateBody, TransformedCleaner } from '@/types/api';

export interface TaskManagement {
  roles: Role[];
  hotelId?: string;
  cleaners?: TransformedCleaner[];
  updateData?: TaskUpdateBody;
}
