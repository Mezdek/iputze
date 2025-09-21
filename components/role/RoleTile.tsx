import { useUpdateRole } from "@/hooks";
import type { EnhancedRole } from "@/types";
import { addToast } from "@heroui/react";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { ApprovalRequest } from "../ApprovalRequest";

export function RoleTile({ role }: { role: EnhancedRole }) {
    const bg = role.status === RoleStatus.DISABLED ? "bg-gray-400" : "bg-cyan-400"
    const approvalIsDisabled = role.level !== RoleLevel.PENDING;
    const { mutateAsync: updateRole } = useUpdateRole({ hotelId: role.hotelId, roleId: role.id })
    const handleApprove = async () => {
        try {
            const res = await updateRole({ level: RoleLevel.CLEANER })
            addToast({
                title: "Successful!",
                description: `You have approved ${role.name}!`,
                color: "success",
            });
            return;
        } catch (e) {
            console.error(e)
            addToast({
                title: "Error!",
                description: `Approveal of ${role.name} was not successful!`,
                color: "danger",
            });
            return;
        }
    }
    const handleDeactivate = async () => {
        try {
            const res = await updateRole({ status: RoleStatus.DISABLED })
            addToast({
                title: "Successful!",
                description: `You have deactivated ${role.name}!`,
                color: "success",
            });
            return;
        } catch (e) {
            console.error(e)
            addToast({
                title: "Error!",
                description: `Deactivation of ${role.name} was not successful!`,
                color: "danger",
            });
            return;
        }
    }

    return (
        <div className={`flex flex-col gap-1 border-solid border-green-900 ${bg} rounded-xl border-2 p-4 h-fit`}>
            <p className="bg-amber-400 p-1.5 rounded-xl">{role.level}{role.status === "DISABLED" ? <i> Inactive</i> : null}</p>
            <ul className="p-2.5">
                <li>Name: {role.name}</li>
                <li>Email: {role.email}</li>
                <p>{!role.notes || role.notes === "" ? "No Notes" : role.notes}</p>
            </ul>
            <div className="flex w-full justify-between">
                {role.status === RoleStatus.ACTIVE &&
                    <ApprovalRequest
                        modalButton={{ text: approvalIsDisabled ? "Approved" : "Approve", color: approvalIsDisabled ? "default" : "success", isDisabled: approvalIsDisabled }}
                        question={`Are you sure you want to approve ${role.name}`}
                        submitButton={{ action: handleApprove }}
                        header={`Approval of ${role.name}`}

                    />
                }
                {role.level === RoleLevel.CLEANER &&
                    <ApprovalRequest
                        modalButton={{
                            text: role.status === RoleStatus.ACTIVE ? "Deactivate" : "Inactive",
                            color: role.status === RoleStatus.ACTIVE ? "warning" : "default",
                            isDisabled: role.status !== RoleStatus.ACTIVE
                        }}
                        header={`Deactivate ${role.name}`}
                        question={`Are you sure you want to deactivate ${role.name}`}
                        submitButton={{ action: handleDeactivate }}
                    />
                }
            </div>
        </div>
    )
}