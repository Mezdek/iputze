import type { InjectedAuthProps, TAssignmentResponse } from '@/types';

export interface TabProps extends InjectedAuthProps {
  hotelName: string;
  hotelId: string;
  isLoading?: boolean;
}

export interface AssignmentsTabProps extends TabProps {
  assignments: TAssignmentResponse[] | null | undefined;
}
