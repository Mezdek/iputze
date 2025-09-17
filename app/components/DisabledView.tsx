import type { TRole } from "@/lib/types";

export function DisabledView({ role }: { role: TRole }) {
    return (<div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
        <p>
            Hotel
        </p>
        <p>
            {role.hotel.name}
        </p>
        <p>
            The hotel has disabled your position, please contact them for more information
        </p>
    </div>)
}
