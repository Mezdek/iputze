'use client'

import type { AssignmentResponse, InjectedAuthProps } from "@/types";
import { ClickableNames, Notes, Tile } from "@components";
import { addToast, Button } from "@heroui/react";
import { useUpdateAssignment } from "@hooks";
import { roleCheck } from "@lib";
import { AssignmentStatus } from "@prisma/client";
import { dateAndTime, nextStatus, statusString } from "../utils";

export function AssignmentTile({
    assignment,
    user,
}: { assignment: AssignmentResponse } & InjectedAuthProps) {
    const {
        createdAt,
        dueAt,
        id: assignmentId,
        isActive,
        room: { hotelId, number },
        status,
        assignedByUser,
        cleaners,
    } = assignment;

    const { mutateAsync: update, isPending } = useUpdateAssignment({
        assignmentId,
        hotelId,
    });

    const { isAssignmentCleaner, isHotelManager } = roleCheck({
        user,
        hotelId,
        cleaners,
    });

    const handleArchiving = async () => {
        try {
            await update({ isActive: false });
            addToast({ title: "Archived", description: "Assignment successfully archived!", color: "success" });
        } catch {
            addToast({ title: "Oops!", description: "Assignment could not be archived!", color: "warning" });
        }
    };



    const handleStatus = async () => {
        const newStatus = nextStatus[status];
        if (!newStatus) return;
        try {
            await update({ status: newStatus });
            addToast({
                title: "Status Changed!",
                description: `Assignment set to ${statusString[newStatus]}`,
                color: "success",
            });
        } catch {
            addToast({ title: "Oops!", description: "Assignment status could not be changed!", color: "danger" });
        }
    };

    return (
        <Tile
            header={
                <>
                    <div className="flex flex-col">
                        <h2 id={`assignment-${assignmentId}-title`}>Room {number}</h2>
                        <h3 className="text-sm italic">{statusString[status].state}</h3>
                    </div>
                    {isActive && !isAssignmentCleaner && status !== AssignmentStatus.DONE && (
                        <Button
                            disabled={isPending}
                            color="success"
                            className="rounded-lg text-sm font-medium"
                            onPress={handleStatus}
                        >
                            {statusString[status].button}
                        </Button>
                    )}
                    {(!isHotelManager || !isActive) && (
                        <Button
                            disabled={isPending || !isActive}
                            isDisabled={isPending || !isActive}
                            onPress={handleArchiving}
                            variant="solid"
                            color="default"
                            className="rounded-lg text-sm font-medium"
                        >
                            {isActive ? "Archive" : "Archived"}
                        </Button>
                    )}
                </>
            }

            body={
                <>
                    <p><strong>Due:</strong> {dateAndTime({ dateTime: dueAt })}</p>
                    <p className="flex justify-between items-center">
                    </p>
                    <p><strong>Cleaners:</strong> <ClickableNames users={cleaners} isDisabled={!isActive} /></p>
                    <p><strong>Assigned by:</strong> {assignedByUser ? assignedByUser.name : "Deleted Account"}</p>
                    <p><strong>Created:</strong> {dateAndTime({ dateTime: createdAt })}</p>
                </>
            }

            footer={
                <Notes assignmentId={assignmentId} hotelId={hotelId} userId={user.id} isDisabled={!isActive} />

            }
        />
    );
}