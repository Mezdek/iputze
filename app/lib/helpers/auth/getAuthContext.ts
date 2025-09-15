import { AuthErrors } from "@constants";
import { verifyAccessToken } from "@helpers";
import { APP_ERRORS, prisma } from "@lib";
import type { AuthContext } from "@lib/types";
import { NextRequest } from "next/server";

export const getAuthContext = async (req: NextRequest): Promise<AuthContext> => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) throw APP_ERRORS.unauthorized();

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, avatarUrl: true },
    });
    if (!user) throw APP_ERRORS.notFound(AuthErrors.USER_NOT_FOUND);

    const roles = await prisma.role.findMany({ where: { userId: user.id } });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl ?? undefined,
        roles,
    };
};
