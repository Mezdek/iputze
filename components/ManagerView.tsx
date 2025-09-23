'use client';

import type { EnhancedRole } from "@/types";
import { AssignmentCreation, AssignmentTile, EntityTab, ListRenderer, RoleTile, RoomCreation, RoomTile } from "@components";
import { Tab, Tabs } from "@heroui/react";
import { useAssignments, useRoles, useRooms } from "@hooks";
import type { Room } from "@prisma/client";
import { useParams } from "next/navigation";
import { SpecialViewProps } from "./types";
import { sections } from "./utils";


export function ManagerView({ user }: SpecialViewProps) {

    const { hotelId } = useParams<{ hotelId: string }>();
    const role = user.roles.find((r) => r.hotel.id === hotelId);
    if (!role) return null;

    const { data: workers, isLoading: workersLoading } = useRoles({ hotelId });
    const { data: rooms, isLoading: roomsLoading } = useRooms({ hotelId });
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments({ hotelId });

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Tabs
                aria-label="Hotel management sections"
                destroyInactiveTabPanel
                className="flex"
            >
                <Tab key={sections.ROOMS} title={sections.ROOMS}>
                    <EntityTab
                        hotelName={role.hotel.name}
                        isLoading={roomsLoading}
                        emptyMessage="No rooms have been created yet."
                        hotelId={hotelId}
                        user={user}
                        button={
                            <RoomCreation hotelId={hotelId} />
                        }
                    >
                        <ListRenderer data={rooms} isLoading={roomsLoading} empty={<></>}>
                            {(room: Room) => <RoomTile key={room.id} room={room} />}
                        </ListRenderer>
                    </EntityTab>
                </Tab>

                <Tab key={sections.WORKERS} title={sections.WORKERS}>
                    <EntityTab
                        hotelName={role.hotel.name}
                        isLoading={workersLoading}
                        emptyMessage="No workers are assigned to this hotel yet."
                        hotelId={hotelId}
                        user={user}
                    >
                        <ListRenderer data={workers} isLoading={workersLoading} empty={<></>}>
                            {(worker: EnhancedRole) => <RoleTile key={worker.id} role={worker} />}
                        </ListRenderer>
                    </EntityTab>
                </Tab>
                <Tab key={sections.ASSIGNMENTS} title={sections.ASSIGNMENTS}>
                    <EntityTab
                        hotelName={role.hotel.name}
                        isLoading={assignmentsLoading}
                        emptyMessage="No assignments have been created yet."
                        hotelId={hotelId}
                        user={user}
                        button={
                            < AssignmentCreation hotelId={hotelId} />
                        }
                    >
                        <ListRenderer data={assignments} isLoading={assignmentsLoading} empty={<div>No Assignments</div>}>
                            {(assignment) => <AssignmentTile assignment={assignment} key={assignment.id} user={user} />}
                        </ListRenderer>
                    </EntityTab>
                </Tab>
            </Tabs>
        </div>
    );
}