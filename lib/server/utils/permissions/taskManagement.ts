import { isAdmin, isHotelManager } from '@lib/server';

import type { AdminRights, TaskManagement } from '@/types';

/**
 * Determines whether the actor can create an task.
 * Admins or managers of the hotel may create tasks.
 */
export const canCreateTask = ({ roles, hotelId }: TaskManagement): boolean => {
  return isAdmin({ roles }) || isHotelManager({ roles, hotelId });
};

/**
 * Determines whether the actor can view/list tasks.
 * Admins, hotel managers, or assigned cleaners.
 */
export const canListTasks = ({ roles, hotelId }: TaskManagement): boolean => {
  return isAdmin({ roles }) || isHotelManager({ roles, hotelId });
};

/**
 * Determines whether the actor can delete an task.
 * Only admins or hotel managers.
 */
export const canDeleteTask = ({ roles }: AdminRights): boolean =>
  isAdmin({ roles });
