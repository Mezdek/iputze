import { AssignmentResponse, InjectedAuthProps } from "@/types";

export interface SpecialViewProps extends InjectedAuthProps { }

export interface TabProps extends SpecialViewProps {
    hotelName: string;
    hotelId: string;
    isLoading?: boolean
}

export interface AssignmentsTabProps extends TabProps { assignments: AssignmentResponse[] | null | undefined }
