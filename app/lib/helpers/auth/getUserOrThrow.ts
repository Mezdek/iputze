import { User } from "@/lib/types/api";
import { AUTH_HEADER, AuthErrors, BEARER_PREFIX } from "@constants";
import { verifyAccessToken } from "@helpers";
import { APP_ERRORS, prisma } from "@lib";
import { NextRequest } from "next/server";

export const getUserOrThrow = async (req: NextRequest): Promise<User> => {
    const authHeader = req.headers.get(AUTH_HEADER);
    console.log({authHeader})
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
