'use client';

import {
    CleanerView,
    DisabledView,
    LoadingScreen,
    ManagerView,
    NavigationBar,
    PendingView,
    withAuthGuard,
} from "@components";
import { useMe } from "@hooks";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { useParams } from "next/navigation";
import { FC } from "react";

const ViewSelector: Record<RoleLevel, FC> = {
    [RoleLevel.ADMIN]: ManagerView,
    [RoleLevel.MANAGER]: ManagerView,
    [RoleLevel.CLEANER]: CleanerView,
    [RoleLevel.PENDING]: PendingView,
};

const AccessDeniedView: FC = () => (
    <p className="flex justify-center items-center w-full h-screen text-6xl bg-red-400">
        Access Denied
    </p>
);

function Hotel() {
    const { data: user } = useMe();
    const params = useParams<{ hotelId: string }>();

    let Component: FC;

    if (!user) {
        Component = LoadingScreen;
    } else {
        const role = user.roles.find((r) => r.hotel.id === params.hotelId);

        if (!role) {
            Component = AccessDeniedView;
        } else if (role.status === RoleStatus.DISABLED) {
            Component = DisabledView;
        } else {
            Component = ViewSelector[role.level];
        }
    }

    return (
        <>
            <NavigationBar />
            <Component />
        </>
    );
}

export default withAuthGuard(Hotel);
