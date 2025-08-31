import type { AuthContext } from "@app/types/auth";
import { CustomErrorMessages } from "@constants/httpResponses";
import { getSessionToken } from "@helpers/getSessionToken";
import { APP_ERRORS } from "@lib/errors/factories";
import { prisma } from "@lib/prisma";

/**
 * Returns the current logged-in user and all their roles.
 * `name` is guaranteed to be defined because it is mandatory on registration.
 */
export const getAuthContext = async (): Promise<AuthContext> => {
    // 1️⃣ Get session token from cookies
    const sessionToken = await getSessionToken();

    // 2️⃣ Load active session
    const session = await prisma.session.findFirst({
        where: { sessionToken, expires: { gt: new Date() } },
    });
    if (!session) throw APP_ERRORS.unauthorized();

    // 3️⃣ Load user info
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true, name: true, avatarUrl: true },
    });
    if (!user) throw APP_ERRORS.notFound(CustomErrorMessages.USER_NOT_FOUND);

    // 4️⃣ Load all roles
    const roles = await prisma.role.findMany({
        where: { userId: user.id },
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl ?? undefined,
        roles,
    };
};
