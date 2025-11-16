'use client';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Image,
} from '@heroui/react';
import { RoleLevel, RoleStatus } from '@prisma/client';
import type { ReactNode } from 'react';

import { ApprovalRequest } from '@/components/ui';
import { useRoles, useUpdateRole } from '@/hooks';
import type { TRoleWithUser } from '@/types';

export function Staff({ hotelId }: { hotelId: string }) {
  const { data: roles } = useRoles({ hotelId });
  const activeRoles =
    roles?.filter(({ status }) => status === RoleStatus.ACTIVE) ?? [];
  const managers = activeRoles.filter(
    ({ level }) => level === RoleLevel.MANAGER
  );
  const cleaners = activeRoles.filter(
    ({ level }) => level === RoleLevel.CLEANER
  );
  const pendings = activeRoles.filter(
    ({ level }) => level === RoleLevel.PENDING
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-foreground">Staff</h1>

      <StaffSection count={managers.length} title="Managers">
        {managers.map((role) => (
          <Person hotelId={hotelId} key={role.id} role={role} />
        ))}
      </StaffSection>

      <StaffSection count={cleaners.length} title="Cleaners">
        {cleaners.map((role) => (
          <Person hotelId={hotelId} key={role.id} role={role} />
        ))}
      </StaffSection>

      <StaffSection count={pendings.length} title="Pending Approval">
        {pendings.map((role) => (
          <Person hotelId={hotelId} key={role.id} role={role} />
        ))}
      </StaffSection>
    </div>
  );
}

function StaffSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <Chip color="default" size="sm" variant="flat">
          {count}
        </Chip>
      </div>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
}

function Person({ hotelId, role }: { hotelId: string; role: TRoleWithUser }) {
  const { mutateAsync: update } = useUpdateRole({ hotelId, roleId: role.id });

  return (
    <Card className="bg-content1">
      <CardHeader className="flex-col items-start gap-3 pb-0">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-lg text-foreground">
              {role.user.name}
            </h4>
            <p className="text-sm text-default-500">
              Joined {new Date(role.createdAt).toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Chip color={getRoleColor(role.level)} size="sm" variant="flat">
            {role.level}
          </Chip>
          <Chip color={getStatusColor(role.status)} size="sm" variant="flat">
            {role.status}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="gap-3 pt-3">
        <Image
          alt={`${role.user.name}'s avatar`}
          className="object-cover rounded-lg w-full aspect-square"
          src={role.user.avatarUrl ?? undefined}
        />
        {role.user.bio && (
          <p className="text-sm text-default-600 line-clamp-3">
            {role.user.bio}
          </p>
        )}
      </CardBody>

      <CardFooter className="gap-2">
        {role.level === RoleLevel.CLEANER &&
          role.status === RoleStatus.ACTIVE && (
            <ApprovalRequest
              header="Fire Cleaner"
              modalButtonProps={{
                text: 'Fire',
                color: 'danger',
                className: 'w-full',
              }}
              question={`Are you sure you want to fire ${role.user.name}?`}
              submitButtonProps={{ color: 'danger' }}
              submitHandler={async () => {
                await update({ status: RoleStatus.DISABLED });
              }}
            />
          )}

        {role.level === RoleLevel.PENDING &&
          role.status === RoleStatus.ACTIVE && (
            <ApprovalRequest
              header="Approve New Cleaner"
              modalButtonProps={{
                text: 'Approve',
                color: 'success',
                className: 'w-full',
              }}
              question={`Are you sure you want to accept ${role.user.name} in the team?`}
              submitButtonProps={{ color: 'success' }}
              submitHandler={async () => {
                await update({ level: RoleLevel.CLEANER });
              }}
            />
          )}
      </CardFooter>
    </Card>
  );
}

const getRoleColor = (
  level: RoleLevel
): 'primary' | 'secondary' | 'warning' | 'danger' => {
  switch (level) {
    case RoleLevel.MANAGER:
      return 'primary';
    case RoleLevel.CLEANER:
      return 'secondary';
    case RoleLevel.PENDING:
      return 'warning';
    default:
      return 'danger';
  }
};

const getStatusColor = (status: RoleStatus): 'success' | 'warning' => {
  return status === RoleStatus.ACTIVE ? 'success' : 'warning';
};
