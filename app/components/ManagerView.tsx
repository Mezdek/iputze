import { RoomCreation, RoomTile } from "@components";
import { useRooms } from "@hooks";
import type { TRole } from "@lib/types";

export function ManagerView({ role }: { role: TRole }) {
    const hotelId = role.hotel.id
    const { data: rooms, isLoading } = useRooms({ hotelId });

    return (
        <div className="flex flex-col gap-10 items-center w-full h-screen">
            <div className="flex justify-around items-center w-full h-1/8 bg-amber-200 px-3 py-3">
                <p className="text-2xl font-bold">
                    Hotel:  {role.hotel.name}
                </p>
                <RoomCreation hotelId={hotelId} />
                {/* <Button color="secondary" onPress={() => { createRoom({ number: rooms ? rooms[rooms.length - 1].number + 1 : "a1" }) }} >Add a new room</Button> */}
            </div>
            <div className="flex gap-2 w-full p-4 bg-cyan-200 h-full flex-wrap">
                {!!rooms

                    ? rooms.map(
                        (room, index) => {
                            return (
                                <RoomTile key={index} room={{ ...room }} />
                            )
                        }
                    )
                    : isLoading ? <div>Loading</div> : <div>No Rooms</div>
                }
            </div>
        </div>
    )
}