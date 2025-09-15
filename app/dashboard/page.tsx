'use client'
import { ROUTES } from "@/lib/constants";
import { Button } from "@heroui/react";
import { useMe, useSignOut } from "@hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data, isLoading } = useMe();
    const { mutate: signOut, isPending } = useSignOut();
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !data) {
            router.push(ROUTES.HOME);
        }
    }, [isLoading, data, router]);

    return (
        <div className="flex gap-5 items-center justify-around w-full h-screen">
            <div className="flex flex-col gap-1 justify-around w-1/4 h-1/2">
                <p className="text-center font-bold text-4xl">
                    Dashboard
                </p>
                <p className="text-center font-bold text-xl text-blue-700">
                    Hello {data?.name}
                </p>
                <Button color="danger" onPress={() => signOut()} isDisabled={isPending}>Sign Out</Button>
            </div>
        </div>
    )
}
