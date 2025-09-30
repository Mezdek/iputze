import { MeResponse, SafeUser, TRole } from "@/types";
import { RoleLevel, RoleStatus, type Role } from "@prisma/client";


type RoleCheckProps = { hotelId?: string, user: MeResponse, cleaners?: SafeUser[] }

type RoleCheckReturn = { isAdmin: boolean, isHotelManager: boolean, isHotelCleaner: boolean, isAssignmentCleaner: boolean }

export const isActiveRole = (r: Role | TRole) => r.status === RoleStatus.ACTIVE;
export const isAdminRole = (r: Role | TRole) => r.level === RoleLevel.ADMIN;
export const isManagerRole = (r: Role | TRole) => r.level === RoleLevel.MANAGER;
export const isCleanerRole = (r: Role | TRole) => r.level === RoleLevel.CLEANER;
export const isSameHotel = (r: Role | TRole, hotelId: string) => "hotelId" in r ? r.hotelId === hotelId : r.hotel.id === hotelId;

export const roleCheck = (props: RoleCheckProps): RoleCheckReturn => {

    const { hotelId, user, cleaners } = props;
    const { roles } = user
    const isAdmin = roles.some((r) => isActiveRole(r) && isActiveRole(r));
    const isHotelManager = !!hotelId && roles.some((r) => isSameHotel(r, hotelId) && isManagerRole(r) && isActiveRole(r));
    const isHotelCleaner = !!hotelId && roles.some((r) => isSameHotel(r, hotelId) && isCleanerRole(r) && isActiveRole(r));
    const isAssignmentCleaner = !!cleaners && cleaners.some(cleaner => cleaner.id === user.id)

    return { isAdmin, isHotelCleaner, isHotelManager, isAssignmentCleaner }
}


export const isAdmin =
    ({ roles }: { roles: Role[] }): boolean =>
        roles.some((r) => isAdminRole(r) && isActiveRole(r));

export const isHotelManager =
    ({ roles, hotelId }: { roles: Role[]; hotelId: string }): boolean =>
        roles.some((r) => isSameHotel(r, hotelId) && isManagerRole(r) && isActiveRole(r));

export const isHotelCleaner = ({ roles, hotelId, }: { roles: Role[]; hotelId: string; }): boolean =>
    roles.some((r) => isSameHotel(r, hotelId) && isCleanerRole(r) && isActiveRole(r));

export const hasManagerPermission =
    ({ roles, hotelId, }: { roles: Role[]; hotelId: string; }): boolean =>
        isAdmin({ roles }) || isHotelManager({ roles, hotelId })



