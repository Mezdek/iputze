import { CustomErrorMessages } from "@constants/httpResponses";
import { getAuthContext } from "@helpers/getAuthContext";
import { parseId } from "@helpers/parseId";
import { canModifyRole } from "@helpers/permissions/roleManagement";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { RoleLevel, RoleStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Types for request body
interface UpdateRoleRequest {
    level?: RoleLevel;
    status?: RoleStatus;
}

type Params = { roleId: string };

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    try {

        const roleId = parseId(params.roleId);

        const data: UpdateRoleRequest = await req.json();

        if (!data.level && !data.status) {
            throw APP_ERRORS.badRequest(CustomErrorMessages.MISSING_PARAMETERS);
        }

        const newLevel = data.level;
        const newStatus = data.status;

        const updateData: Partial<UpdateRoleRequest> = {
            ...(newLevel ? { level: newLevel } : {}),
            ...(newStatus ? { status: newStatus } : {}),
        };


        const { roles } = await getAuthContext();

        // Load target role
        const targetRole = await prisma.role.findUnique({
            where: { id: roleId },
            include: { user: true, hotel: true },
        });
        if (!targetRole) throw APP_ERRORS.notFound(CustomErrorMessages.ROLE_NOT_FOUND);

        if (!canModifyRole({ roles, targetRole, newLevel, newStatus })) throw APP_ERRORS.forbidden(CustomErrorMessages.ROLE_MODIFICATION_NOT_ALLOWED);


        // Perform update
        const updatedRole = await prisma.role.update({
            where: { id: roleId },
            data: updateData
        });

        return NextResponse.json(updatedRole);

    } catch (error: unknown) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }
        console.error(error);
        return APP_ERRORS.internalServerError(CustomErrorMessages.UNEXPECTED_SERVER_ERROR).nextResponse();
    }
}

