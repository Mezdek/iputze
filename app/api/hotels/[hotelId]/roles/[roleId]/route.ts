import type { RoleParams, RoleUpdateBody } from "@apptypes";
import { APP_ERRORS, canModifyRole, GeneralErrors, getRoleOrThrow, getUserOrThrow, RolesErrors, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import type { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleParams }) => {

        const data = await req.json() as RoleUpdateBody;
        if (!data.level && !data.status) throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMS);

        const targetRole = await getRoleOrThrow(params.roleId);

        const newLevel = data.level;
        const newStatus = data.status;

        const updateData: Partial<RoleUpdateBody> = {
            ...(newLevel ? { level: newLevel } : {}),
            ...(newStatus ? { status: newStatus } : {}),
        };

        const { roles } = await getUserOrThrow(req);

        if (!canModifyRole({ roles, targetRole, newLevel, newStatus })) throw APP_ERRORS.forbidden(RolesErrors.EDITING_DENIED);

        // Perform update
        const updatedRole = await prisma.role.update({
            where: { id: targetRole.id },
            data: updateData
        });

        return NextResponse.json<Role>(updatedRole);
    }
)
