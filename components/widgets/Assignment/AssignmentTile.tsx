'use client'

import type { AssignmentResponse, InjectedAuthProps } from "@/types";
import { ClickableNames, Notes, RichText, Tile } from "@components";
import { addToast, Button } from "@heroui/react";
import { useErrorToast, useUpdateAssignment } from "@hooks";
import { roleCheck } from "@lib";
import { AssignmentStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { dateAndTime, NEXT_STATUS, STATUS_STRING } from "../../utils";

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

    const t = useTranslations("assignment")
    const { showErrorToast } = useErrorToast()

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
        } catch (e) {
            showErrorToast(e)
        }
    };



    const handleStatus = async () => {
        const newStatus = NEXT_STATUS[status];
        if (!newStatus) return;
        try {
            await update({ status: newStatus });
            addToast({
                title: "Status Changed!",
                description: `Assignment set to ${STATUS_STRING[newStatus]}`,
                color: "success",
            });
        } catch (e) {
            showErrorToast(e)
        }
    };

    return (
        <Tile
            header={
                <>
                    <div className="flex flex-col">
                        <h2 id={`assignment-${assignmentId}-title`}>{t("header", { number })}</h2>
                        <h3 className="text-sm italic">
                            {t(`status.${STATUS_STRING[status].state}`)}
                        </h3>
                    </div>
                    {isActive && isAssignmentCleaner && status !== AssignmentStatus.DONE && (
                        <Button
                            disabled={isPending}
                            color="success"
                            className="rounded-lg text-sm font-medium"
                            onPress={handleStatus}
                        >
                            {t(`status_update.${STATUS_STRING[status].button}`)}
                        </Button>
                    )}
                    {(isHotelManager || !isActive) && (
                        <Button
                            disabled={isPending || !isActive}
                            isDisabled={isPending || !isActive}
                            onPress={handleArchiving}
                            variant={isActive ? "solid" : "bordered"}
                            color={isActive ? "danger" : "default"}
                            className="rounded-lg text-sm font-medium"
                        >
                            {
                                isActive ? t("archive") : t("archived")
                            }
                        </Button>
                    )}
                </>
            }

            body={
                <>
                    <p>
                        {t.rich("due_at", {
                            strong:
                                (chunks) => <strong>{chunks}</strong>,
                            dueAt: dateAndTime({ dateTime: dueAt })
                        })}
                    </p>
                    <p className="flex justify-between items-center">
                    </p>
                    <div>
                        <RichText>
                            {(tags) => t.rich("cleaners", { ...tags })}
                        </RichText>
                        <ClickableNames users={cleaners} isDisabled={!isActive} />
                    </div>
                    <RichText>
                        {(tags) => t.rich("assigned_by", { ...tags, name: assignedByUser?.name ?? t("deleted") })}
                    </RichText>
                    <p>
                        {t.rich("created_at", {
                            strong:
                                (chunks) => <strong>{chunks}</strong>,
                            createdAt: dateAndTime({ dateTime: createdAt })
                        })}
                    </p>
                </>
            }

            footer={
                <Notes assignmentId={assignmentId} hotelId={hotelId} userId={user.id} isDisabled={!isActive} />

            }
        />
    );
}