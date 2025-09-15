import type { RoleParams, UpdateRoleBody } from "@/lib/types";
import { GeneralErrors, RolesErrors } from "@/lib/constants";
import { canModifyRole, getAuthContext, getRoleOrThrow } from "@/lib/helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = withErrorHandling(
    async (req: NextRequest, { params }: { params: RoleParams }) => {

        const data: UpdateRoleBody = await req.json();
        if (!data.level && !data.status) throw APP_ERRORS.badRequest(GeneralErrors.MISSING_PARAMETERS);

        const targetRole = await getRoleOrThrow(params.roleId);

        const newLevel = data.level;
        const newStatus = data.status;

        const updateData: Partial<UpdateRoleBody> = {
            ...(newLevel ? { level: newLevel } : {}),
            ...(newStatus ? { status: newStatus } : {}),
        };

        const { roles } = await getAuthContext(req);

        if (!canModifyRole({ roles, targetRole, newLevel, newStatus })) throw APP_ERRORS.forbidden(RolesErrors.ROLE_MODIFICATION_NOT_ALLOWED);

        // Perform update
        const updatedRole = await prisma.role.update({
            where: { id: targetRole.id },
            data: updateData
        });

        return NextResponse.json(updatedRole);
    }
)
