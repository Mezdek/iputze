import { ApprovalRequest } from "@components";
import {
    addToast
} from "@heroui/react";
import { useDeleteRoom } from "@hooks";
import { Room } from "@prisma/client";
import { isAxiosError } from "axios";


export function RoomDeletion({ room }: { room: Room }) {
    const { hotelId, id: roomId, number: roomNumber } = room
    const { mutateAsync: deleteRoom } = useDeleteRoom({ hotelId, roomId })

    const handleDelete = async () => {
        try {
            await deleteRoom();
            addToast({
                title: "Room deleted successfully",
                description: `Room ${room.number} was deleted successfully`,
                color: "success",
            })
        } catch (e) {
            if (isAxiosError(e) && e.status === 400) {
                addToast({
                    title: "Room could not be deleted!",
                    description: "There are still assignments attached to this room!",
                    color: "warning",
                })
            } else {
                console.error(e);
                addToast({
                    title: "Room could not be deleted!",
                    description: "An unknown error was thrown!",
                    color: "warning",
                })
            }
        }
    }

    return (

        <ApprovalRequest
            header="Room Deletion"
            modalButton={{
                text: "Delete",
                color: "warning"
            }}
            question={`Are you sure you want to delete room ${roomNumber}?`}
            submitButton={{
                action: handleDelete,
            }}
        />

    );
}