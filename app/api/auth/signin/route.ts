import { AuthErrors, HttpStatus, RateLimitKeys, REFRESH_TOKEN_NAME } from "@constants";
import { APP_ERRORS, withErrorHandling } from "@errors";
import { checkRateLimit, generateAccessToken, generateRefreshToken, ResponseCookieOptions } from "@helpers";
import { prisma } from "@lib/prisma";
import type { SignInRequestBody, SignInResponse } from "@lib/types";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(async (req: NextRequest) => {
    checkRateLimit(req, RateLimitKeys.SIGNIN, 5, 300_000);

    const { email, password } = await req.json() as SignInRequestBody;
    if (!email || !password) throw APP_ERRORS.badRequest(AuthErrors.INVALID_CREDENTIALS);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) throw APP_ERRORS.unauthorized();

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) throw APP_ERRORS.unauthorized();

    const accessToken = generateAccessToken({ sub: user.id, email: user.email });
    const refreshToken = await generateRefreshToken(user.id);

    const res = NextResponse.json<SignInResponse>(
        { user: { id: user.id, email: user.email, name: user.name }, accessToken },
        { status: HttpStatus.OK }
    );

    res.cookies.set(REFRESH_TOKEN_NAME, refreshToken, ResponseCookieOptions);

    return res;
});
