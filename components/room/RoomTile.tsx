import { useDeleteRoom } from "../../hooks";
import { Room } from "@prisma/client";
import { ApprovalRequest } from "../ApprovalRequest";
import { RoomUpdate } from "./RoomUpdate";

export function RoomTile({ room }: { room: Room }) {
    const { mutate: deleteRoom } = useDeleteRoom({ roomId: room.id, hotelId: room.hotelId })
    return (
        <div className="flex flex-col gap-1 border-solid border-green-900 bg-cyan-400 rounded-xl border-2 p-4 h-fit">
            <p className="bg-amber-400 p-1.5 rounded-xl">Room</p>
            <ul className="p-2.5">
                <li>Number: {room.number}</li>
                <li>Cleanliness: {room.cleanliness}</li>
                <li>Occupancy: {room.occupancy}</li>
                <p>{!room.notes || room.notes === "" ? "No Notes" : room.notes}</p>
            </ul>
            <div className="flex w-full justify-between">
                <RoomUpdate room={room} />
                <ApprovalRequest
                    buttonText="Delete Room"
                    cancelButtonText="Cancel"
                    header="Room Deletion"
                    question={`Are you sure you want to delete room ${room.number}?`}
                    submitAction={deleteRoom}
                    submitButtonText="Delete"
                    submitVariant="danger"
                />
            </div>
        </div>
    )
}