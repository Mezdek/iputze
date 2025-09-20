'use client';

import { CleanerView, DisabledView, ManagerView, PendingView, withAuthGuard } from "@components";
import { useMe } from "@hooks";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

function Hotel() {
    const { data: user } = useMe();
    const router = useRouter();
    const params = useParams<{ hotelId: string }>();

    const role = user?.roles.find(r => r.hotel.id === params.hotelId)

    if (!role) return <p className="flex justify-center items-center w-full h-screen text-6xl bg-red-400">Access Denied</p>
    if (role.status === RoleStatus.DISABLED) return <DisabledView role={role} />
    if (role.level === RoleLevel.ADMIN || role.level === RoleLevel.MANAGER) return <ManagerView role={role} />
    if (role.level === RoleLevel.CLEANER) return <CleanerView role={role} />
    if (role.level === RoleLevel.PENDING) return <PendingView role={role} />
    return null
};






export default withAuthGuard(Hotel);
