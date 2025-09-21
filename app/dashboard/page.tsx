'use client';

import { NavigationBar, withAuthGuard } from "@components";
import { Button } from "@heroui/react";
import { useMe } from "@hooks";
import { getPath } from "@lib";
import { useRouter } from "next/navigation";
import JoinHotel from "./JoinHotel";

function Dashboard() {
    const { data: user } = useMe();
    const router = useRouter();


    if (!user) {
        console.error("No logged user was found, please clear your browser cache if this problem persists")
        router.replace("/");
        return;
    }
    const { name, roles } = user

    return (
        <>
            <NavigationBar />
            <div className="flex gap-5 items-center justify-around w-full h-screen">
                <div className="flex h-full w-full items-center">
                    <p className="text-center font-bold text-5xl w-full">Hello {name}</p>
                </div>
                <div className="flex items-center h-full w-full">
                    <div className="bg-blue-200 w-full h-3/4 p-8 flex flex-wrap gap-4 rounded-2xl">

                        {
                            roles.length > 0
                                ?
                                roles.map((role) => (
                                    <Button
                                        color="secondary"
                                        className="p-7 text-medium h-16"
                                        onPress={() => router.push(getPath({ hotelId: role.hotel.id }).HOTEL)}
                                        key={role.id}
                                    >
                                        {role.hotel.name}
                                    </Button>

                                ))
                                :
                                <div className="flex flex-col justify-between gap-4 text-center">
                                    <p>You havent joined any hotel!</p>
                                </div>
                        }
                        <JoinHotel />
                    </div>
                </div>
            </div>
        </>
    );
}

export default withAuthGuard(Dashboard);
