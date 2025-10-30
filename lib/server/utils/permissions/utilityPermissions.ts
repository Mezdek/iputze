import { type Role, RoleLevel, RoleStatus } from '@prisma/client';

type TBaseRole = Pick<Role, 'level' | 'status'>;
type THasHotel = { hotelId: string } | { hotel: { id: string } };

export const isActiveRole = (role: TBaseRole) =>
  role.status === RoleStatus.ACTIVE;
export const isAdminRole = (role: TBaseRole) => role.level === RoleLevel.ADMIN;
export const isManagerRole = (role: TBaseRole) =>
  role.level === RoleLevel.MANAGER;
export const isCleanerRole = (role: TBaseRole) =>
  role.level === RoleLevel.CLEANER;
export const isPendingRole = (role: TBaseRole) =>
  role.level === RoleLevel.PENDING;
export const isSameHotel = (
  role: { hotelId: string } | { hotel: { id: string } },
  hotelId: string
) => ('hotelId' in role ? role.hotelId === hotelId : role.hotel.id === hotelId);

export const isAdmin = ({ roles }: { roles: TBaseRole[] }): boolean =>
  roles.some((role) => isAdminRole(role) && isActiveRole(role));

export const isHotelManager = ({
  roles,
  hotelId,
}: {
  roles: (TBaseRole & THasHotel)[];
  hotelId: string;
}): boolean =>
  roles.some(
    (role) =>
      isSameHotel(role, hotelId) && isManagerRole(role) && isActiveRole(role)
  );

export const isTaskCleaner = ({
  cleaners,
  user,
}: {
  cleaners: { id: string }[];
  user: { id: string };
}) => !!cleaners && cleaners.some((cleaner) => cleaner.id === user.id);

export const getRolesByLevel = <T extends TBaseRole>({
  roles,
  level,
  activeOnly = false,
}: {
  roles: T[];
  level: RoleLevel;
  activeOnly?: boolean;
}) => {
  if (!roles || !level) return [];
  switch (level) {
    case RoleLevel.ADMIN:
      return roles.filter(
        (role) => isAdminRole(role) && (isActiveRole(role) || !activeOnly)
      );
    case RoleLevel.MANAGER:
      return roles.filter(
        (role) => isManagerRole(role) && (isActiveRole(role) || !activeOnly)
      );
    case RoleLevel.CLEANER:
      return roles.filter(
        (role) => isCleanerRole(role) && (isActiveRole(role) || !activeOnly)
      );
    case RoleLevel.PENDING:
      return roles.filter(
        (role) => isPendingRole(role) && (isActiveRole(role) || !activeOnly)
      );
    default:
      return [];
  }
};

export const getAdminRole = <T extends TBaseRole>({ roles }: { roles: T[] }) =>
  getRolesByLevel<T>({ roles, level: RoleLevel.ADMIN, activeOnly: true })[0];

export const isHotelCleaner = ({
  roles,
  hotelId,
}: {
  roles: (TBaseRole & THasHotel)[];
  hotelId: string;
}): boolean =>
  roles.some(
    (role) =>
      isSameHotel(role, hotelId) && isCleanerRole(role) && isActiveRole(role)
  );

export const hasManagerPermission = ({
  roles,
  hotelId,
}: {
  roles: (TBaseRole & THasHotel)[];
  hotelId: string;
}): boolean => isAdmin({ roles }) || isHotelManager({ roles, hotelId });
