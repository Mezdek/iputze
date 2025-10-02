
import { APP_ERRORS, AuthErrors, checkRateLimit, HttpStatus, parseExpiryToMilliSeconds, RATE_LIMIT_KEYS, ResponseCookieOptions, SESSION_COOKIE_EXP, SESSION_COOKIE_KEY, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import { compare } from "bcrypt";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import type { SignInRequestBody, SignInResponse } from "@/types";


export const POST = withErrorHandling(async (req: NextRequest) => {
    checkRateLimit(req, RATE_LIMIT_KEYS.SIGNIN, 5, 300_000);

    const { email, password } = await req.json() as SignInRequestBody;
    if (!email || !password) throw APP_ERRORS.badRequest(AuthErrors.INVALID_CREDENTIALS);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) throw APP_ERRORS.unauthorized();

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) throw APP_ERRORS.unauthorized();

    const expiresAt = new Date(Date.now() + parseExpiryToMilliSeconds(SESSION_COOKIE_EXP));

    const session = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt,
            ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
            userAgent: req.headers.get("user-agent") ?? undefined,
        },
    });

    const res = NextResponse.json<SignInResponse>(
        { user: { id: user.id, email: user.email, name: user.name } },
        { status: HttpStatus.OK }
    );

    res.cookies.set(SESSION_COOKIE_KEY, session.id, ResponseCookieOptions);

    return res;
});
