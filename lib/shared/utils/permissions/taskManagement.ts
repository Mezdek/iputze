import { checkRoles } from '@/lib/shared/utils/permissions';
import type { NoteManagement, TaskManagement, TaskUpdateBody } from '@/types';

const { isAdmin, isHotelManager, isTaskCleaner } = checkRoles;

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
export const canViewTasks = ({
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
export const canDeleteTask = ({ roles, hotelId }: TaskManagement): boolean =>
  isAdmin({ roles }) || (!!hotelId && isHotelManager({ roles, hotelId }));

export const canModifyTask = ({
  roles,
  hotelId,
  cleaners,
  updateData,
}: TaskManagement): boolean => {
  if (isAdmin({ roles })) return true;
  if (!updateData || !hotelId) return false;

  const updateFields = Object.keys(updateData) as (keyof TaskUpdateBody)[];

  const allowedFieldsForManagers: Set<keyof TaskUpdateBody> = new Set([
    'cancellationNote',
    'priority',
  ]);
  const allowedFieldsForCleaners: Set<keyof TaskUpdateBody> = new Set([
    'cancellationNote',
    'status',
  ]);

  if (isHotelManager({ roles, hotelId }))
    return updateFields.every((field) => allowedFieldsForManagers.has(field));

  if (!cleaners || !roles[0]) return false;

  const { userId } = roles[0];

  if (isTaskCleaner({ cleaners, userId }))
    return updateFields.every((field) => allowedFieldsForCleaners.has(field));

  return false;
};

export const canDeleteNote = ({
  authorId,
  userId,
}: NoteManagement): boolean => {
  return authorId === userId;
};
