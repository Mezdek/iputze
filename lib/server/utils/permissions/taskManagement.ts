import { isAdmin, isHotelManager, isTaskCleaner } from '@lib/server';

import type { TaskManagement } from '@/types';

/**
 * Determines whether the actor can create an task.
 * Admins or managers of the hotel may create tasks.
 */
export const canCreateTask = ({ roles, hotelId }: TaskManagement): boolean => {
  return (
    isAdmin({ roles }) || (!!hotelId && isHotelManager({ roles, hotelId }))
  );
};

/**
 * Determines whether the actor can view/list tasks.
 * Admins, hotel managers, or assigned cleaners.
 */
export const canListTasks = ({
  roles,
  hotelId,
  cleaners,
}: TaskManagement): boolean => {
  return (
    isAdmin({ roles }) ||
    (!!hotelId && isHotelManager({ roles, hotelId })) ||
    (!!roles[0] &&
      !!cleaners &&
      isTaskCleaner({ userId: roles[0].userId, cleaners }))
  );
};

/**
 * Determines whether the actor can delete an task.
 * Only admins or hotel managers.
 */
export const canDeleteTask = ({ roles }: TaskManagement): boolean =>
  isAdmin({ roles });
