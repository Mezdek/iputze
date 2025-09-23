'use client'

import { RoomDeletion, RoomUpdate, Tile } from "@components";
import type { Room } from "@prisma/client";

export function RoomTile({ room }: { room: Room }) {
    const isDirty = room.cleanliness === "DIRTY";

    return (
        <Tile
            header={
                <>
                    <h2 className="font-semibold">Room</h2>
                    {isDirty && <span className="italic text-sm">Needs Cleaning</span>}
                </>
            }

            body={
                <>
                    <p><strong>Number:</strong> {room.number}</p>
                    <p><strong>Cleanliness:</strong> {room.cleanliness}</p>
                    <p><strong>Occupancy:</strong> {room.occupancy}</p>
                    <p className="text-gray-500 italic">
                        <strong>Notes:</strong> {room.notes && room.notes.trim() !== "" ? room.notes : "No notes"}
                    </p>
                </>
            }

            footer={
                <>
                    <RoomUpdate room={room} />
                    <RoomDeletion room={room} />
                </>
            }

        />
    );
}
