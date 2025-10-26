import { getRoleOrThrow, getUserOrThrow, prisma } from '@lib/db';
import { canModifyRole } from '@lib/server';
import {
  APP_ERRORS,
  GeneralErrors,
  RolesErrors,
  withErrorHandling,
} from '@lib/shared';
import type { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { RoleParams, RoleUpdateBody } from '@/types';

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoleParams }) => {
    const data = (await req.json()) as RoleUpdateBody;
    if (!data.level && !data.status)
      throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);

    const targetRole = await getRoleOrThrow(params.roleId);

    const newLevel = data.level;
    const newStatus = data.status;

    const updateData: Partial<RoleUpdateBody> = {
      ...(newLevel ? { level: newLevel } : {}),
      ...(newStatus ? { status: newStatus } : {}),
    };

    const { roles } = await getUserOrThrow(req);

    if (!canModifyRole({ roles, targetRole, newLevel, newStatus }))
      throw APP_ERRORS.forbidden(RolesErrors.EDITING_DENIED);

    // Perform update
    const updatedRole = await prisma.role.update({
      where: { id: targetRole.id },
      data: updateData,
    });

    return NextResponse.json<Role>(updatedRole);
  }
);
