import { Room } from "@prisma/client";
import { RoomDeletion } from "./RoomDeletion";
import { RoomUpdate } from "./RoomUpdate";

export function RoomTile({ room }: { room: Room }) {
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
                <RoomDeletion room={room} />
            </div>
        </div>
    )
}