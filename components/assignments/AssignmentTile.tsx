import { useMe, useUpdateAssignment } from "../../hooks";
import { AssignmentResponse } from "@/types";
import { addToast, Button } from "@heroui/react";
import { AssignmentStatus, RoleLevel, RoleStatus, User } from "@prisma/client";
import { AddNote } from "./AddNote";

export function AssignmentTile({ assignment }: { assignment: AssignmentResponse }) {
    const { createdAt, dueAt, id, isActive, notes, room, status, users, assignedByUser } = assignment;
    const { mutateAsync } = useUpdateAssignment({ assignmentId: id, hotelId: room.hotelId })
    const { data: user } = useMe();
    const role =
        user &&
        user.roles.find(r => r.hotel.id === room.hotelId);
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

    const handleStatus = async () => {
        try {
            let newStatus: AssignmentStatus;
            if (status === AssignmentStatus.PENDING) {
                newStatus = AssignmentStatus.IN_PROGRESS;
            } else if (status === AssignmentStatus.IN_PROGRESS) {
                newStatus = AssignmentStatus.DONE;
            } else {
                return
            }
            await mutateAsync({ status: newStatus });
            addToast({
                title: "Status Changed!",
                description: `Assignment was set on ${statusString[newStatus]}`,
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
            className={`flex flex-col gap-1 border-solid border-green-900 rounded-xl border-2 p-4 h-fit ${isActive ? "bg-cyan-400" : "bg-gray-400"} `}>
            <div className="flex justify-between bg-fuchsia-600 p-1.5 rounded-xl items-center">
                <p className="">Assignment</p>
                {isManager && isActive && <Button onPress={handleArchiving} color="warning">Archive</Button>}
                {!isActive && <p className="">Archived</p>}
            </div>
            <ul className="p-2.5">
                <li>Room number: {room.number}</li>
                <li>
                    Due: <DateAndTime dateTime={dueAt} />
                </li>
                <div className="flex justify-between items-center">
                    <span>
                        Status: {statusString[status]}
                    </span>
                    {!(status === AssignmentStatus.DONE) && isActive && isAssignmentCleaner && <span className="bg-green-600 rounded-2xl py-2 px-1 cursor-pointer" onClick={handleStatus}>Update Process</span>}
                </div>
                <li>Assignees: <Cleaners users={users} /></li>
                <li>Assigned by: {assignedByUser === null ? "Deleted Account" : assignedByUser.name}</li>
                <p>Notes: {!notes || notes === "" ? "No Notes" : notes}</p>
                <li>
                    Created: <DateAndTime dateTime={createdAt} />
                </li>
                <li>Id: {id}</li>
            </ul>
            <div className="flex w-full justify-between">
                <AddNote assignment={assignment} />
            </div>
        </div>
    )
}

const statusString: Record<AssignmentStatus, string> = {
    DONE: "done",
    IN_PROGRESS: "in progress",
    PENDING: "pending"
}

function DateAndTime({ dateTime, locale, options }: { dateTime: string | number | Date; locale?: Intl.Locale; options?: Intl.DateTimeFormatOptions }) {
    const parsedOtions: Intl.DateTimeFormatOptions = {
        hour12: false,
        minute: "numeric",
        hour: "numeric",
        hourCycle: "h23",
        day: "numeric",
        weekday: "long",
        month: "short",
        ...options
    };
    const dateString = new Date(dateTime).toLocaleDateString(locale ?? "de-DE", parsedOtions);
    return dateString

}

function Cleaners({ users }: { users: Omit<User, "passwordHash">[] }) {
    const clickableUserNames = users.map
        (
            (user, index, array) =>
                <span key={index}>
                    <i onClick={() => console.log(user.id)} style={{ fontStyle: "normal", cursor: "pointer" }}>
                        {user.name}
                    </i>
                    {index < array.length - 1 ? ", " : ""}
                </span>
        )
    return clickableUserNames
}
