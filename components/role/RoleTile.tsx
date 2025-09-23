'use client'

import type { EnhancedRole } from "@/types";
import { ApprovalRequest } from "@components";
import { addToast } from "@heroui/react";
import { useUpdateRole } from "@hooks";
import { RoleLevel, RoleStatus } from "@prisma/client";

export function RoleTile({ role }: { role: EnhancedRole }) {
    const bgColor = role.status === RoleStatus.DISABLED ? "bg-gray-300 text-gray-700" : "bg-cyan-400 text-black";
    const approvalIsDisabled = role.level !== RoleLevel.PENDING;
    const { mutateAsync: updateRole } = useUpdateRole({ hotelId: role.hotelId, roleId: role.id });

    const handleApprove = async () => {
        try {
            await updateRole({ level: RoleLevel.CLEANER });
            addToast({ title: "Approved!", description: `${role.name} is now approved`, color: "success" });
        } catch {
            addToast({ title: "Error!", description: `Could not approve ${role.name}`, color: "danger" });
        }
    };

    const handleDeactivate = async () => {
        try {
            await updateRole({ status: RoleStatus.DISABLED });
            addToast({ title: "Deactivated!", description: `${role.name} has been deactivated`, color: "success" });
        } catch {
            addToast({ title: "Error!", description: `Could not deactivate ${role.name}`, color: "danger" });
        }
    };

    return (
        <div className={`flex flex-col gap-2 border-2 border-green-900 rounded-xl p-4 ${bgColor}`}>
            <div className="flex justify-between items-center bg-amber-400 p-1.5 rounded-xl">
                <span className="font-semibold">{role.level}</span>
                {role.status === RoleStatus.DISABLED && (
                    <span className="italic text-sm" aria-label="Inactive role">(Inactive)</span>
                )}
            </div>

            <ul className="p-2 space-y-1 list-none">
                <li><strong>Name:</strong> {role.name}</li>
                <li><strong>Email:</strong> {role.email}</li>
            </ul>

            <p className="text-sm italic text-gray-700">
                <strong>Notes:</strong> {role.notes && role.notes.length > 0 ? role.notes : "No notes"}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
                {role.status === RoleStatus.ACTIVE && (
                    <ApprovalRequest
                        header={`Approve ${role.name}`}
                        modalButton={{
                            text: approvalIsDisabled ? "Approved" : "Approve",
                            color: approvalIsDisabled ? "default" : "success",
                            isDisabled: approvalIsDisabled,
                        }}
                        question={`Are you sure you want to approve ${role.name}?`}
                        submitButton={{ action: handleApprove }}
                    />
                )}

                {role.level === RoleLevel.CLEANER && (
                    <ApprovalRequest
                        header={`Deactivate ${role.name}`}
                        modalButton={{
                            text: role.status === RoleStatus.ACTIVE ? "Deactivate" : "Inactive",
                            color: role.status === RoleStatus.ACTIVE ? "warning" : "default",
                            isDisabled: role.status !== RoleStatus.ACTIVE,
                        }}
                        question={`Are you sure you want to deactivate ${role.name}?`}
                        submitButton={{ action: handleDeactivate }}
                    />
                )}
            </div>
        </div>
    );
}
