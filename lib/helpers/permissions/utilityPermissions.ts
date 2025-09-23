import { MeResponse, SafeUser } from "@/types";
import { RoleLevel, RoleStatus, type Role } from "@prisma/client";


type RoleCheckProps = { hotelId?: string, user: MeResponse, cleaners?: SafeUser[] }

type RoleCheckReturn = { isAdmin: boolean, isHotelManager: boolean, isHotelCleaner: boolean, isAssignmentCleaner: boolean }

export const roleCheck = (props: RoleCheckProps): RoleCheckReturn => {

    const { hotelId, user, cleaners } = props;
    const { roles } = user
    const isAdmin = roles.some((r) => r.level === RoleLevel.ADMIN && r.status === RoleStatus.ACTIVE);
    const isHotelManager = !!hotelId && roles.some((r) => r.hotel.id === hotelId && r.level === RoleLevel.MANAGER && r.status === RoleStatus.ACTIVE);
    const isHotelCleaner = !!hotelId && roles.some((r) => r.hotel.id === hotelId && r.level === RoleLevel.CLEANER && r.status === RoleStatus.ACTIVE);
    const isAssignmentCleaner = !!cleaners && cleaners.some(cl => cl.id === user.id)

    return { isAdmin, isHotelCleaner, isHotelManager, isAssignmentCleaner }
}


export const isAdmin =
    ({ roles }: { roles: Role[] }): boolean =>
        roles.some((r) => r.level === RoleLevel.ADMIN && r.status === RoleStatus.ACTIVE);

export const isHotelManager =
    ({ roles, hotelId }: { roles: Role[]; hotelId: string }): boolean =>
        roles.some((r) => r.hotelId === hotelId && r.level === RoleLevel.MANAGER && r.status === RoleStatus.ACTIVE);

export const isHotelCleaner = ({ roles, hotelId, }: { roles: Role[]; hotelId: string; }): boolean =>
    roles.some((r) => r.hotelId === hotelId && r.level === RoleLevel.CLEANER && r.status === RoleStatus.ACTIVE);

export const hasManagerPermission =
    ({ roles, hotelId, }: { roles: Role[]; hotelId: string; }): boolean =>
        isAdmin({ roles }) || isHotelManager({ roles, hotelId })



