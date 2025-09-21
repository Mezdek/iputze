import { useAssignments, useMe } from "@hooks";
import { useParams } from "next/navigation";
import { HotelBanner } from "./HotelBanner";
import { ListRenderer } from "./ListRenderer";
import { AssignmentTile } from "./assignments";

export function CleanerView() {
    const { data: user } = useMe();
    if (!user) return;
    const { hotelId } = useParams<{ hotelId: string }>();
    const role = user.roles.find(r => r.hotel.id === hotelId)
    if (!role) return
    const { data: assignments, isLoading } = useAssignments({ hotelId });


    return (
        <div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
            <HotelBanner hotelName={role.hotel.name} />
            <ListRenderer data={assignments} isLoading={isLoading} empty={<div>No Assignments</div>}>
                {(assignment) => <AssignmentTile assignment={assignment} key={assignment.id} />}
            </ListRenderer>
        </div>)
}
