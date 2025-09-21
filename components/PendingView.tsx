import type { TRole } from "@/types";

export function PendingView({ role }: { role: TRole }) {
    return (<div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
        <p>
            Hotel
        </p>
        <p>
            {role.hotel.name}
        </p>
        <p>
            The hotel has not yet approved your application, please wait or contact the hotel for more information
        </p>
    </div>)
}
