import type { AssignmentResponse, InjectedAuthProps } from '@/types';

export interface TabProps extends InjectedAuthProps {
  hotelName: string;
  hotelId: string;
  isLoading?: boolean;
}

export interface AssignmentsTabProps extends TabProps {
  assignments: AssignmentResponse[] | null | undefined;
}
