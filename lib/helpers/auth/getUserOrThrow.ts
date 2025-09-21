import type { SafeUserWithRoles } from "@apptypes";
import { APP_ERRORS, AUTH_HEADER, AuthErrors, BEARER_PREFIX, verifyAccessToken } from "@lib";
import { prisma } from "@lib/prisma";
import { NextRequest } from "next/server";

export const getUserOrThrow = async (req: NextRequest): Promise<SafeUserWithRoles> => {
    const authHeader = req.headers.get(AUTH_HEADER);
    if (!authHeader?.startsWith(BEARER_PREFIX)) throw APP_ERRORS.unauthorized();
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        include: { roles: true }
    });
    if (!user) throw APP_ERRORS.notFound(AuthErrors.USER_NOT_FOUND);

    const { passwordHash, ...userWithoutPasswordHash } = user;

    return userWithoutPasswordHash;
};
