import type { EnhancedRole } from "@apptypes";
import { RoleTile, RoomCreation, RoomTile } from "@components";
import { Tab, Tabs } from "@heroui/react";
import { useAssignments, useMe, useRoles, useRooms } from "@hooks";
import type { Room } from "@prisma/client";
import { useParams } from "next/navigation";
import { AssignmentsTab } from "./AssignmentsTab";
import { HotelBanner } from "./HotelBanner";
import { ListRenderer } from "./ListRenderer";
import { TabProps } from "./types";


const sections = {
    ASSIGNMENTS: "Assignments",
    ROOMS: "Rooms",
    WORKERS: "Workers"
} as const;


export function ManagerView() {
    const { data: user } = useMe();
    if (!user) return;
    const { hotelId } = useParams<{ hotelId: string }>();
    const role = user.roles.find(r => r.hotel.id === hotelId)
    if (!role) return
    const { data: workers } = useRoles({ hotelId })
    const { data: rooms, isLoading } = useRooms({ hotelId });
    const { data: assignments } = useAssignments({ hotelId });

    return (
        <div className="h-screen w-full">
            <Tabs className="" aria-label="Sections" defaultSelectedKey={sections.ASSIGNMENTS}>
                <Tab key={sections.ROOMS} title={sections.ROOMS}>
                    <RoomsTab hotelName={role.hotel.name} hotelId={hotelId} rooms={rooms} isLoading={isLoading} />
                </Tab>
                <Tab key={sections.WORKERS} title={sections.WORKERS}>
                    <WorkersTab hotelName={role.hotel.name} hotelId={hotelId} workers={workers} isLoading={isLoading} />
                </Tab>
                <Tab key={sections.ASSIGNMENTS} title={sections.ASSIGNMENTS} >
                    <AssignmentsTab hotelName={role.hotel.name} hotelId={hotelId} assignments={assignments} isLoading={isLoading} />
                </Tab>
            </Tabs>
        </div>
    )
}



interface RoomsTabProps extends TabProps { rooms: Room[] | null | undefined }

function RoomsTab({ hotelName, rooms, isLoading, hotelId }: RoomsTabProps) {
    return (
        <div className="flex flex-col gap-10 items-center w-full h-full">
            <HotelBanner hotelName={hotelName}>
                < RoomCreation hotelId={hotelId} />
            </HotelBanner>
            <ListRenderer data={rooms} isLoading={isLoading} empty={<div>No Rooms</div>}>
                {(room) => <RoomTile room={room} key={room.id} />}
            </ListRenderer>
        </div>
    )
}


interface WorkersTabProps extends TabProps { workers: EnhancedRole[] | null | undefined }

function WorkersTab({ hotelName, workers, isLoading }: WorkersTabProps) {
    return (
        <div className="flex flex-col gap-10 items-center w-full h-full">
            <HotelBanner hotelName={hotelName} />
            <ListRenderer data={workers} isLoading={isLoading} empty={<div>No Workers</div>}>
                {(worker) => <RoleTile role={worker} key={worker.id} />}
            </ListRenderer>
        </div>
    )
}

