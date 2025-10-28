'use client';

import { AssignmentCard, HotelBanner, ListRenderer } from '@components';
import { useAssignments } from '@hooks';
import { useParams } from 'next/navigation';

import type { InjectedAuthProps } from '@/types';

export function CleanerView({ user }: InjectedAuthProps) {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { data: assignments, isLoading } = useAssignments({ hotelId });

  const role = user.roles.find((r) => r.hotel.id === hotelId);
  if (!role) return null;

  return (
    <div className="flex flex-col gap-2 items-center justify-around w-full h-screen">
      <HotelBanner hotelName={role.hotel.name} />
      <ListRenderer data={assignments} isLoading={isLoading}>
        {(assignment) => (
          <AssignmentCard
            showImages
            assignment={assignment}
            key={assignment.id}
            user={user}
          />
        )}
      </ListRenderer>
    </div>
  );
}
