'use client'

import { ApprovalRequest, Tile } from "@components";
import { addToast } from "@heroui/react";
import { useUpdateRole } from "@hooks";
import { RoleLevel, RoleStatus } from "@prisma/client";

import type { EnhancedRole } from "@/types";

export function RoleTile({ role }: { role: EnhancedRole }) {
    const isInactive = role.status === RoleStatus.DISABLED;
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
        <Tile
            body={
                <>
                    <p><strong>Name:</strong> {role.name}</p>
                    <p><strong>Email:</strong> {role.email}</p>
                    <p className="text-gray-500 italic">
                        <strong>Notes:</strong> {role.notes && role.notes.length > 0 ? role.notes : "No notes"}
                    </p>
                </>
            }

            footer={
                <>
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
                </>
            }

            header={
                <>
                    <h2 className="font-semibold">{role.level}</h2>
                    {isInactive && <span className="italic text-sm">(Inactive)</span>}
                </>
            }
        />
    );
}
