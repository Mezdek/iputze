'use client'

import { AssignmentTile, HotelBanner, ListRenderer } from "@components";
import { useAssignments } from "@hooks";
import { useParams } from "next/navigation";
import type { SpecialViewProps } from "./types";

export function CleanerView({ user }: SpecialViewProps) {

    const { hotelId } = useParams<{ hotelId: string }>();
    const role = user.roles.find(r => r.hotel.id === hotelId)
    if (!role) return
    const { data: assignments, isLoading } = useAssignments({ hotelId });


    return (
        <div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
            <HotelBanner hotelName={role.hotel.name} />
            <ListRenderer data={assignments} isLoading={isLoading}>
                {(assignment) => <AssignmentTile assignment={assignment} key={assignment.id} user={user} />}
            </ListRenderer>
        </div>)
}
