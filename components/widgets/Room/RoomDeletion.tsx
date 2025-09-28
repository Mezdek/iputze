'use client'

import { ApprovalRequest } from "@components";
import { addToast } from "@heroui/react";
import { useDeleteRoom, useErrorToast } from "@hooks";
import { Room } from "@prisma/client";
import { useTranslations } from "next-intl";

export function RoomDeletion({ room }: { room: Room }) {
    const { hotelId, id: roomId, number: roomNumber } = room;
    const { mutateAsync: deleteRoom } = useDeleteRoom({ hotelId, roomId });
    const t = useTranslations("room.deletion_panel");
    const { showErrorToast } = useErrorToast();

    const handleDelete = async () => {
        try {
            await deleteRoom();
            addToast({
                title: "Room deleted successfully",
                description: `Room ${roomNumber} was deleted successfully`,
                color: "success",
            });
        } catch (e) {
            showErrorToast(e)
        }
    };

    return (
        <ApprovalRequest
            header={t("header")}
            modalButton={{
                text: t("buttons.open"),
                color: "warning",
            }}
            question={t("approval_question", { number: room.number })}
            submitButton={{
                text: t("buttons.submit"),
                color: "warning",
                action: handleDelete,
            }}
        />
    );
}
