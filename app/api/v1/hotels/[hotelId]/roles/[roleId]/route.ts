import type { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/server/db/prisma';
import { getRoleOrThrow } from '@/lib/server/db/utils/getRoleOrThrow';
import { getUserOrThrow } from '@/lib/server/db/utils/getUserOrThrow';
import { checkRateLimit } from '@/lib/server/utils/rateLimit';
import { RATE_LIMIT_KEYS } from '@/lib/shared/constants';
import { GeneralErrors } from '@/lib/shared/constants/errors/general';
import { RolesErrors } from '@/lib/shared/constants/errors/roles';
import { APP_ERRORS } from '@/lib/shared/errors/api/factories';
import { withErrorHandling } from '@/lib/shared/errors/api/withErrorHandling';
import { checkPermission } from '@/lib/shared/utils/permissions';
import type { RoleParams, RoleUpdateBody } from '@/types';

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: RoleParams }) => {
    await checkRateLimit(req, RATE_LIMIT_KEYS.DATABASE, 'api');

    const data = (await req.json()) as RoleUpdateBody;
    if (!data.level && !data.status)
      throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);
    const { roleId } = await params;
    const targetRole = await getRoleOrThrow(roleId);

    const newLevel = data.level;
    const newStatus = data.status;

    const updateData: Partial<RoleUpdateBody> = {
      ...(newLevel ? { level: newLevel } : {}),
      ...(newStatus ? { status: newStatus } : {}),
    };

    const { roles } = await getUserOrThrow(req);

    if (
      !checkPermission.modification.role({
        roles,
        targetRole,
        newLevel,
        newStatus,
      })
    )
      throw APP_ERRORS.forbidden(RolesErrors.EDITING_DENIED);

    // Perform update
    const updatedRole = await prisma.role.update({
      where: { id: targetRole.id },
      data: updateData,
    });

    return NextResponse.json<Role>(updatedRole);
  }
);
