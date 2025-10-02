'use client';

import {
  AssignmentCreation,
  AssignmentTile,
  EntityTab,
  HotelBanner,
  ListRenderer,
  RoleTile,
  RoomCreation,
  RoomTile,
} from '@components';
import { Tab, Tabs } from '@heroui/react';
import { useAssignments, useRoles, useRooms } from '@hooks';
import type { Room } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { EnhancedRole, InjectedAuthProps } from '@/types';

import { SECTIONS } from './utils';

export function ManagerView({ user }: InjectedAuthProps) {
  const { hotelId } = useParams<{ hotelId: string }>();
  const role = user.roles.find(r => r.hotel.id === hotelId);

  const t = useTranslations('ManagerView');
  const { data: workers, isLoading: workersLoading } = useRoles({ hotelId });
  const { data: rooms, isLoading: roomsLoading } = useRooms({ hotelId });
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments({
    hotelId,
  });

  if (!role) return null;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <HotelBanner hotelName={role.hotel.name} />
      <Tabs
        destroyInactiveTabPanel
        aria-label="Hotel management sections"
        className="flex"
      >
        <Tab className="py-0" key={SECTIONS.ROOMS} title={SECTIONS.ROOMS}>
          <EntityTab
            button={<RoomCreation hotelId={hotelId} />}
            emptyMessage={t('no_rooms_message')}
            isLoading={roomsLoading}
          >
            <ListRenderer data={rooms} isLoading={roomsLoading}>
              {(room: Room) => <RoomTile key={room.id} room={room} />}
            </ListRenderer>
          </EntityTab>
        </Tab>

        <Tab className="py-0" key={SECTIONS.WORKERS} title={SECTIONS.WORKERS}>
          <EntityTab
            emptyMessage={t('no_workers_message')}
            isLoading={workersLoading}
          >
            <ListRenderer data={workers} isLoading={workersLoading}>
              {(worker: EnhancedRole) => (
                <RoleTile key={worker.id} role={worker} />
              )}
            </ListRenderer>
          </EntityTab>
        </Tab>
        <Tab
          className="py-0"
          key={SECTIONS.ASSIGNMENTS}
          title={SECTIONS.ASSIGNMENTS}
        >
          <EntityTab
            button={<AssignmentCreation hotelId={hotelId} />}
            emptyMessage={t('mo_assignments_message')}
            isLoading={assignmentsLoading}
          >
            <ListRenderer data={assignments} isLoading={assignmentsLoading}>
              {assignment => (
                <AssignmentTile
                  assignment={assignment}
                  key={assignment.id}
                  user={user}
                />
              )}
            </ListRenderer>
          </EntityTab>
        </Tab>
      </Tabs>
    </div>
  );
}
