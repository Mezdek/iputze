'use client';

import { withAuthGuard } from "@/components/auth/withAuthGuard";
import { Button } from "@heroui/react";
import { useMe, useSignOut } from "@hooks";
import { RoleLevel } from "@prisma/client";
import { useRouter } from "next/navigation";

function Dashboard() {
    const { data: user } = useMe();
    const { mutate: signOut, isPending, isSuccess } = useSignOut();
    const router = useRouter();

    // Redirect to home once signOut succeeds
    if (isSuccess) {
        router.replace("/");
    }

    console.log({ user })

    const R: Record<RoleLevel, string> = { ADMIN: "Administer", CLEANER: "Check", MANAGER: "Manage", PENDING: "" }

    return (
        <div className="flex gap-5 items-center justify-around w-full h-screen">
            <div className="flex flex-col gap-3 justify-around w-1/4 h-1/2">
                <p className="text-center font-bold text-4xl">Dashboard</p>
                <p className="text-center font-bold text-xl text-blue-700">
                    Hello {user?.name}
                </p>

                {
                    (user?.roles && user?.roles.length > 0)
                        ?
                        user.roles.map((r, i) => (
                            <div key={i}>
                                {
                                    r.level === "PENDING"
                                        ? null
                                        : <Button color="secondary" className="p-7 text-medium" onPress={() => router.push("/hotels/" + r.hotel.id)}> {R[r.level]} {r.hotel.name}</Button>
                                }
                            </div>
                        ))
                        :
                        <div className="flex flex-col justify-between gap-4 text-center">
                            <p>You havent joined any hotel!</p>
                            <Button color="primary" onPress={() => alert("not implemented")}>Join</Button>
                        </div>
                }

                <Button
                    color="danger"
                    onPress={() => signOut()}
                    isDisabled={isPending}
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
}

export default withAuthGuard(Dashboard);
