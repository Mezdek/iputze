'use client';

import { ApprovalRequest, Tile } from '@components';
import { addToast } from '@heroui/react';
import { useUpdateRole } from '@hooks';
import { RoleLevel, RoleStatus } from '@prisma/client';

import type { TRoleWithUser } from '@/types';

export function RoleTile({ role }: { role: TRoleWithUser }) {
  const {
    status,
    level,
    hotelId,
    id: roleId,
    user: { name, notes, email },
  } = role;
  const isInactive = status === RoleStatus.DISABLED;
  const approvalIsDisabled = level !== RoleLevel.PENDING;

  const { mutateAsync: updateRole } = useUpdateRole({ hotelId, roleId });

  const handleApprove = async () => {
    try {
      await updateRole({ level: RoleLevel.CLEANER });
      addToast({
        title: 'Approved!',
        description: `${name} is now approved`,
        color: 'success',
      });
    } catch {
      addToast({
        title: 'Error!',
        description: `Could not approve ${name}`,
        color: 'danger',
      });
    }
  };

  const handleDeactivate = async () => {
    try {
      await updateRole({ status: RoleStatus.DISABLED });
      addToast({
        title: 'Deactivated!',
        description: `${name} has been deactivated`,
        color: 'success',
      });
    } catch {
      addToast({
        title: 'Error!',
        description: `Could not deactivate ${name}`,
        color: 'danger',
      });
    }
  };

  return (
    <Tile
      body={
        <>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p className="text-gray-500 italic">
            <strong>Notes:</strong>{' '}
            {notes && notes.length > 0 ? notes : 'No notes'}
          </p>
        </>
      }
      footer={
        <>
          {status === RoleStatus.ACTIVE && (
            <ApprovalRequest
              header={`Approve ${name}`}
              modalButtonProps={{
                text: approvalIsDisabled ? 'Approved' : 'Approve',
                color: approvalIsDisabled ? 'default' : 'success',
                isDisabled: approvalIsDisabled,
              }}
              question={`Are you sure you want to approve ${name}?`}
              submitButtonProps={{ submitHandler: handleApprove }}
            />
          )}
          {level === RoleLevel.CLEANER && (
            <ApprovalRequest
              header={`Deactivate ${name}`}
              modalButtonProps={{
                text: status === RoleStatus.ACTIVE ? 'Deactivate' : 'Inactive',
                color: status === RoleStatus.ACTIVE ? 'warning' : 'default',
                isDisabled: status !== RoleStatus.ACTIVE,
              }}
              question={`Are you sure you want to deactivate ${name}?`}
              submitButtonProps={{ submitHandler: handleDeactivate }}
            />
          )}
        </>
      }
      header={
        <>
          <h2 className="font-semibold">{level}</h2>
          {isInactive && <span className="italic text-sm">(Inactive)</span>}
        </>
      }
    />
  );
}
