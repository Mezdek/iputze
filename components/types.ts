import { AssignmentResponse } from "@apptypes";

export interface TabProps {
    hotelName: string;
    hotelId: string;
    isLoading?: boolean
}

export interface AssignmentsTabProps extends TabProps { assignments: AssignmentResponse[] | null | undefined }
