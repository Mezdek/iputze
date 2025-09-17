'use client';

import { withAuthGuard } from "@/components/auth/withAuthGuard";
import { useMe } from "@hooks";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

function Hotel() {
    const { data: user } = useMe();
    const router = useRouter();
    const params = useParams<{ hotelId: string }>();

    const role = user?.roles.find(r => r.hotel.id === Number(params.hotelId))

    return (
        <div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
            <p>
                Hotel
            </p>
            {role?.hotel?.name}
            <div>
                {
                    !role
                        ? CM["FORBIDDEN"]
                        : role.status === RoleStatus.DISABLED
                            ? CM["DISABLED"]
                            : CM[role.level]
                }
            </div>
        </div>
    );
};

type Views = RoleLevel | "FORBIDDEN" | "DISABLED";

const CM: Record<Views, React.ReactNode> = { ADMIN: <p>You are an Admin</p>, CLEANER: <p>You are a Cleaner</p>, DISABLED: <p>Your role has been deactivated</p>, FORBIDDEN: <p>Access Denied</p>, MANAGER: <p>You are a Manager</p>, PENDING: <p>You have not yet been approved</p> }


export default withAuthGuard(Hotel);
