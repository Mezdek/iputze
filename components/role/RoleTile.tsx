import type { EnhancedRole } from "@/types";
import { RoleStatus } from "@prisma/client";

export function RoleTile({ role }: { role: EnhancedRole }) {
    const bg = role.status === RoleStatus.DISABLED ? "bg-gray-400" : "bg-cyan-400"
    return (
        <div className={`flex flex-col gap-1 border-solid border-green-900 ${bg} rounded-xl border-2 p-4 h-fit`}>
            <p className="bg-amber-400 p-1.5 rounded-xl">{role.level}{role.status === "DISABLED" ? <i> Inactive</i> : null}</p>
            <ul className="p-2.5">
                <li>Name: {role.name}</li>
                <li>Email: {role.email}</li>
                <p>{!role.notes || role.notes === "" ? "No Notes" : role.notes}</p>
            </ul>
            <div className="flex w-full justify-between">
            </div>
        </div>
    )
}