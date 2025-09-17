import type { TRole } from "@lib/types";

export function CleanerView({ role }: { role: TRole }) {
    return (<div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
        <p>
            Hotel
        </p>
        <p>
            {role.hotel.name}
        </p>
        <p>
            Cleaner's View is still under construction
        </p>
    </div>)
}
