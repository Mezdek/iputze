import { RoomDeletion, RoomUpdate } from "@components";
import type { Room } from "@prisma/client";

export function RoomTile({ room }: { room: Room }) {
    return (
        <article className="flex flex-col gap-3 border-2 border-green-900 bg-cyan-400 rounded-xl p-4 shadow-md transition hover:shadow-lg">
            <header className="bg-amber-400 p-2 rounded-xl text-lg font-semibold">
                Room
            </header>
            <section className="p-2 flex flex-col gap-1">
                <p><strong>Number:</strong> {room.number}</p>
                <p><strong>Cleanliness:</strong> {room.cleanliness}</p>
                <p><strong>Occupancy:</strong> {room.occupancy}</p>
                <p>
                    <strong>Notes:</strong> {room.notes && room.notes.trim() !== "" ? room.notes : "No notes"}
                </p>
            </section>
            <footer className="flex w-full justify-between gap-2 mt-2">
                <RoomUpdate room={room} />
                <RoomDeletion room={room} />
            </footer>
        </article>
    )
}
