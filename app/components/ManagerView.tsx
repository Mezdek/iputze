import { useRoles } from "@/hooks/useRoles";
import { RoomCreation, RoomTile } from "@components";
import { Tab, Tabs } from "@heroui/react";
import { useRooms } from "@hooks";
import type { TRole } from "@lib/types";
import { RoleTile } from "./RoleTile";

type TSections = "ROOMS" | "WORKERS" | "ASSIGNMENTS";
const sections: Record<TSections, string> = {
    ASSIGNMENTS: "Assignments",
    ROOMS: "Rooms",
    WORKERS: "Workers"
};

export function ManagerView({ role }: { role: TRole }) {
    const hotelId = role.hotel.id
    const { data: rooms, isLoading } = useRooms({ hotelId });
    const { data: roles } = useRoles({ hotelId })

    return (
        <div className="h-screen w-full">
            <Tabs className="" aria-label="Sections">
                <Tab key={sections.ROOMS} title={sections.ROOMS}>
                    <div className="flex flex-col gap-10 items-center w-full h-full">
                        <div className="flex justify-around items-center w-full h-1/8 bg-amber-200 px-3 py-3">
                            <p className="text-2xl font-bold">
                                Hotel:  {role.hotel.name}
                            </p>
                            <RoomCreation hotelId={hotelId} />
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
                </Tab>
                <Tab key={sections.WORKERS} title={sections.WORKERS}>
                    <div className="flex gap-2 w-full p-4 bg-cyan-200 h-full flex-wrap">
                        {!!roles

                            ? roles.map(
                                (role, index) => {
                                    return (
                                        <RoleTile key={index} role={role} />
                                    )
                                }
                            )
                            : isLoading ? <div>Loading</div> : <div>No Rooms</div>
                        }
                    </div>
                </Tab>
                <Tab key={sections.ASSIGNMENTS} title={sections.ASSIGNMENTS} />
            </Tabs>
        </div>
    )
}