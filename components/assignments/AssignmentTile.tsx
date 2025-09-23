'use client'

import { roleCheck } from "@/lib";
import type { AssignmentResponse, InjectedAuthProps } from "@/types";
import { addToast, Button } from "@heroui/react";
import { useUpdateAssignment } from "@hooks";
import { AssignmentStatus } from "@prisma/client";
import { ClickableNames } from "./ClickableNames";
import { Notes } from "./Notes";
import { dateAndTime, statusString } from "./utils";

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
    };

    const nextStatus: Record<AssignmentStatus, AssignmentStatus | null> = {
        [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
        [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.DONE,
        [AssignmentStatus.DONE]: null,
    };

    const handleStatus = async () => {
        const newStatus = nextStatus[status];
        if (!newStatus) return;
        try {
            await update({ status: newStatus });
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
    };

    // 🎨 Color coding for statuses
    const statusColors: Record<AssignmentStatus, string> = {
        [AssignmentStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-300",
        [AssignmentStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-300",
        [AssignmentStatus.DONE]: "bg-green-100 text-green-800 border-green-300",
    };

    return (
        <article
            className={`flex flex-col gap-4 rounded-2xl border shadow-md p-5 transition-opacity ${isActive ? "bg-white" : "bg-gray-100 opacity-70 italic"
                }`}
            aria-labelledby={`assignment-${assignmentId}-title`}
        >
            {/* Header */}
            <header className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-2 rounded-xl">
                <h2
                    id={`assignment-${assignmentId}-title`}
                    className="font-semibold text-lg"
                >
                    Assignment
                </h2>
                {isHotelManager && isActive && (
                    <Button
                        disabled={isPending}
                        onPress={handleArchiving}
                        color="warning"
                        className="rounded-lg text-sm font-medium"
                        aria-label="Archive assignment"
                    >
                        Archive
                    </Button>
                )}
                {!isActive && <p className="text-sm font-medium">Archived</p>}
            </header>

            {/* Content */}
            <section className="space-y-2 text-gray-800 text-sm">
                <p>
                    <span className="font-semibold">Room:</span> {number}
                </p>
                <p>
                    <span className="font-semibold">Due:</span>{" "}
                    {dateAndTime({ dateTime: dueAt })}
                </p>
                <p className="flex justify-between items-center">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${statusColors[status]}`}
                    >
                        {statusString[status]}
                    </span>
                    {!(status === AssignmentStatus.DONE) &&
                        isActive &&
                        isAssignmentCleaner && (
                            <Button
                                disabled={isPending}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1 text-xs font-medium shadow-sm"
                                onClick={handleStatus}
                                aria-label="Update assignment status"
                            >
                                Update Progress
                            </Button>
                        )}
                </p>
                <p>
                    <span className="font-semibold">Cleaners:</span>{" "}
                    <ClickableNames users={cleaners} isDisabled={!isActive} />
                </p>
                <p>
                    <span className="font-semibold">Assigned by:</span>{" "}
                    {assignedByUser === null
                        ? "Deleted Account"
                        : assignedByUser.name}
                </p>
                <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {dateAndTime({ dateTime: createdAt })}
                </p>
            </section>

            {/* Footer / Notes */}
            <footer className="border-t border-gray-200 pt-3">
                <Notes assignmentId={assignmentId} hotelId={hotelId} userId={user.id} isDisabled={!isActive} />
            </footer>
        </article>
    );
}
