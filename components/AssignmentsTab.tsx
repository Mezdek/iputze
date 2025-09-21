import { AssignmentCreation, AssignmentTile } from "./assignments";
import { HotelBanner } from "./HotelBanner";
import { ListRenderer } from "./ListRenderer";
import { AssignmentsTabProps } from "./types";

export function AssignmentsTab({ hotelName, isLoading, assignments, hotelId }: AssignmentsTabProps) {
    return (
        <div className="flex flex-col gap-10 items-center w-full h-full">
            <HotelBanner hotelName={hotelName}>
                < AssignmentCreation hotelId={hotelId} />
            </HotelBanner>
            <ListRenderer data={assignments} isLoading={isLoading} empty={<div>No Assignments</div>}>
                {(assignment) => <AssignmentTile assignment={assignment} key={assignment.id} />}
            </ListRenderer>
        </div>
    )
}