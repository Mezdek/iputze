'use client';

import {
  CleanerView,
  DeniedAccessView,
  DisabledView,
  ManagerView,
  PendingView,
  withAuthGuard,
} from '@components';
import { RoleLevel, RoleStatus } from '@prisma/client';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

import type { InjectedAuthProps, MeResponse } from '@/types';

export interface HotelViewProps extends InjectedAuthProps {
  hotelId: string;
}

const ViewSelector: Record<RoleLevel, FC<HotelViewProps>> = {
  [RoleLevel.ADMIN]: ManagerView,
  [RoleLevel.MANAGER]: ManagerView,
  [RoleLevel.CLEANER]: CleanerView,
  [RoleLevel.PENDING]: PendingView,
};

function getViewForRole(user: MeResponse, hotelId: string): FC<HotelViewProps> {
  const role = user.roles.find((r) => r.hotel.id === hotelId);

  if (!role) return DeniedAccessView;
  if (role['status'] === RoleStatus.DISABLED) return DisabledView;

  return ViewSelector[role['level']];
}

function Hotel({ user }: InjectedAuthProps) {
  const { hotelId } = useParams<{ hotelId: string }>();
  const Component = getViewForRole(user, hotelId);

  return <Component hotelId={hotelId} user={user} />;
}

export default withAuthGuard(Hotel);
