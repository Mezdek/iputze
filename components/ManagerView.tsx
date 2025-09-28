'use client';

import type { EnhancedRole } from "@/types";
import { AssignmentCreation, AssignmentTile, EntityTab, HotelBanner, ListRenderer, RoleTile, RoomCreation, RoomTile } from "@components";
import { Tab, Tabs } from "@heroui/react";
import { useAssignments, useRoles, useRooms } from "@hooks";
import type { Room } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { SpecialViewProps } from "./types";
import { sections } from "./utils";


export function ManagerView({ user }: SpecialViewProps) {

    const { hotelId } = useParams<{ hotelId: string }>();
    const role = user.roles.find((r) => r.hotel.id === hotelId);
    if (!role) return null;
    const t = useTranslations("ManagerView");
    const { data: workers, isLoading: workersLoading } = useRoles({ hotelId });
    const { data: rooms, isLoading: roomsLoading } = useRooms({ hotelId });
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments({ hotelId });

    return (
        <div className="min-h-screen w-full flex flex-col">
            <HotelBanner hotelName={role.hotel.name} />
            <Tabs
                aria-label="Hotel management sections"
                destroyInactiveTabPanel
                className="flex"
            >
                <Tab key={sections.ROOMS} title={sections.ROOMS} className="py-0">
                    <EntityTab
                        isLoading={roomsLoading}
                        emptyMessage={t("no_rooms_message")}
                        button={
                            <RoomCreation hotelId={hotelId} />
                        }
                    >
                        <ListRenderer data={rooms} isLoading={roomsLoading}>
                            {(room: Room) => <RoomTile key={room.id} room={room} />}
                        </ListRenderer>
                    </EntityTab>
                </Tab>

                <Tab key={sections.WORKERS} title={sections.WORKERS} className="py-0">
                    <EntityTab
                        isLoading={workersLoading}
                        emptyMessage={t("no_workers_message")}
                    >
                        <ListRenderer data={workers} isLoading={workersLoading}>
                            {(worker: EnhancedRole) => <RoleTile key={worker.id} role={worker} />}
                        </ListRenderer>
                    </EntityTab>
                </Tab>
                <Tab key={sections.ASSIGNMENTS} title={sections.ASSIGNMENTS} className="py-0">
                    <EntityTab
                        isLoading={assignmentsLoading}
                        emptyMessage={t("mo_assignments_message")}
                        button={
                            < AssignmentCreation hotelId={hotelId} />
                        }
                    >
                        <ListRenderer data={assignments} isLoading={assignmentsLoading}>
                            {(assignment) => <AssignmentTile assignment={assignment} key={assignment.id} user={user} />}
                        </ListRenderer>
                    </EntityTab>
                </Tab>
            </Tabs>
        </div>
    );
}