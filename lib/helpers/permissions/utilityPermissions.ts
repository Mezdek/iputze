import { RoleLevel, RoleStatus, type Role } from "@prisma/client";


export const adminRole = ({ roles }: { roles: Role[] }): Role | undefined =>
    roles.find((r) => r.level === RoleLevel.ADMIN && r.status === RoleStatus.ACTIVE);


export const managerRole = ({
    roles,
    hotelId,
}: {
    roles: Role[];
    hotelId: string;
}): Role | undefined =>
    roles.find((r) => r.hotelId === hotelId && r.level === RoleLevel.MANAGER && r.status === RoleStatus.ACTIVE);


export const hasManagerPermission = ({
    roles,
    hotelId,
}: {
    roles: Role[];
    hotelId: string;
}): boolean =>
    !!adminRole({ roles }) || !!managerRole({ roles, hotelId })



export const cleanerRole = ({
    roles,
    hotelId,
}: {
    roles: Role[];
    hotelId: string;
}): Role | undefined =>
    roles.find(
        (r) =>
            r.hotelId === hotelId && r.level === RoleLevel.CLEANER && r.status === RoleStatus.ACTIVE
    );

