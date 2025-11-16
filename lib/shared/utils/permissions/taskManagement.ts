import {
  isAdmin,
  isHotelManager,
  isTaskCleaner,
} from '@/lib/shared/utils/permissions/utilityPermissions';
import type { NoteManagement, TaskManagement, TaskUpdateBody } from '@/types';

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
    'cancelationNote',
    'priority',
  ]);
  const allowedFieldsForCleaners: Set<keyof TaskUpdateBody> = new Set([
    'cancelationNote',
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

export const canDeleteArtifact = ({
  authorId,
  userId,
  roles,
}: NoteManagement): boolean => {
  return authorId === userId || (!!roles && isAdmin({ roles }));
};

export const canAddArtifact = ({
  roles,
  hotelId,
  cleaners,
}: TaskManagement): boolean => {
  if (isAdmin({ roles })) return true;
  if (!hotelId) return false;

  if (isHotelManager({ roles, hotelId })) return true;

  if (!cleaners || !roles[0]) return false;

  const { userId } = roles[0];

  if (isTaskCleaner({ cleaners, userId })) return true;

  return false;
};
