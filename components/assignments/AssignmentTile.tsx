import type { AssignmentResponse } from "@apptypes";
import { addToast, Button } from "@heroui/react";
import { useMe, useUpdateAssignment } from "@hooks";
import { AssignmentStatus, RoleLevel, RoleStatus } from "@prisma/client";
import { ClickableNames } from "./ClickableNames";
import { Notes } from "./Notes";
import { dateAndTime, statusString } from "./utils";

export function AssignmentTile({ assignment }: { assignment: AssignmentResponse }) {
    const { createdAt, dueAt, id: assignmentId, isActive, room: { hotelId, number }, status, assignedByUser, cleaners } = assignment;
    const { mutateAsync } = useUpdateAssignment({ assignmentId, hotelId })
    const { data: user } = useMe();

    const role = user && user.roles.find(r => r.hotel.id === hotelId);
    const isManager = role && role.level === RoleLevel.MANAGER && role.status === RoleStatus.ACTIVE;
    const isAssignmentCleaner = role && role.level === RoleLevel.CLEANER && role.status === RoleStatus.ACTIVE;

    const handleArchiving = async () => {
        try {
            await mutateAsync({ isActive: false });
            addToast({
                title: "Archived",
                description: "Assignment was successfully archived!",
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: "Oops!",
                description: "Assignment could not be archived!",
                color: "warning",
            });
        }
    }

    const nextStatus: Record<AssignmentStatus, AssignmentStatus | null> = {
        [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
        [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.DONE,
        [AssignmentStatus.DONE]: null,
    };

    const handleStatus = async () => {
        const newStatus = nextStatus[status];
        if (!newStatus) return;
        try {
            await mutateAsync({ status: newStatus });
            addToast({
                title: "Status Changed!",
                description: `Assignment was set to ${statusString[newStatus]}`,
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: "Oops!",
                description: "Assignment status could not be changed!",
                color: "danger",
            });
        }
    }
    return (
        <div
            className=
            {`flex flex-col gap-1 border-2 border-green-900 rounded-xl p-4 h-fit transition-opacity ${isActive ? "bg-cyan-400" : "bg-gray-400 opacity-70 italic"}`}>
            <div className="flex justify-between bg-fuchsia-600 p-1.5 rounded-xl items-center">
                <p className="">Assignment</p>
                {isManager && isActive && <Button onPress={handleArchiving} color="warning">Archive</Button>}
                {!isActive && <p className="">Archived</p>}
            </div>

            <ul className="p-2.5">
                <li>
                    Room number: {number}
                </li>
                <li>
                    Due: {dateAndTime({ dateTime: dueAt })}
                </li>
                <li className="flex justify-between items-center">
                    <span>
                        Status: {statusString[status]}
                    </span>
                    {!(status === AssignmentStatus.DONE) && isActive && isAssignmentCleaner && (
                        <Button className="bg-green-600 rounded-2xl py-2 px-1 cursor-pointer" onClick={handleStatus}>
                            Update Process
                        </Button>
                    )}
                </li>
                <li>Cleaners: <ClickableNames users={cleaners} /></li>
                <li>Assigned by: {assignedByUser === null ? "Deleted Account" : assignedByUser.name}</li>
                <li>Created: {dateAndTime({ dateTime: createdAt })}</li>
            </ul>
            <div className="flex w-full justify-between">
                <Notes assignmentId={assignmentId} hotelId={hotelId} userId={user?.id!} />
            </div>
        </div>
    )
}


