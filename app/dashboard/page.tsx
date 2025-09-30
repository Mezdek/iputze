'use client';

import { InjectedAuthProps } from "@/types";
import { JoinHotel, withAuthGuard } from "@components";
import { Button, Card } from "@heroui/react";
import { getPath } from "@lib";
import { useRouter } from "next/navigation";

function Dashboard({ user }: InjectedAuthProps) {
    const router = useRouter();
    const { name, roles } = user;

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex flex-col flex-1 items-center justify-center gap-10 p-6 bg-gray-50">
                <h1 className="text-4xl font-bold text-center">
                    Hello {name}
                </h1>

                <Card className="w-full max-w-4xl p-8 rounded-2xl shadow-lg bg-white">
                    {roles.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roles.map((role) => (
                                <li key={role.id}>
                                    <Button
                                        fullWidth
                                        size="lg"
                                        color="secondary"
                                        className="h-16 text-lg font-medium"
                                        onPress={() =>
                                            router.push(getPath({ hotelId: role.hotel.id }).HOTEL)
                                        }
                                    >
                                        {role.hotel.name}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center text-gray-600">
                            <p className="text-lg">You haven’t joined any hotel yet.</p>
                            <p className="text-sm">Join one to get started.</p>
                            <JoinHotel />
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}

export default withAuthGuard(Dashboard);
