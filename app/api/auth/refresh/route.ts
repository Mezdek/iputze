import { HttpStatus, REFRESH_TOKEN_NAME } from "@constants";
import { APP_ERRORS, withErrorHandling } from "@errors";
import { generateAccessToken, generateRefreshToken, ResponseCookieOptions } from "@helpers";
import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(async (req: NextRequest) => {
    const refreshTokenCookie = req.cookies.get(REFRESH_TOKEN_NAME);

    if (!refreshTokenCookie?.value) throw APP_ERRORS.unauthorized();

    const existing = await prisma.refreshToken.findUnique({
        where: { token: refreshTokenCookie.value },
        include: { user: true },
    });

    if (!existing || !existing.user) throw APP_ERRORS.unauthorized();

    // check expiry
    if (existing.expiresAt < new Date()) {
        // cleanup
        await prisma.refreshToken.delete({ where: { id: existing.id } });
        throw APP_ERRORS.unauthorized();
    }

    // issue new access token
    const accessToken = generateAccessToken({
        sub: existing.user.id,
        email: existing.user.email,
    });

    // rotate refresh token (optional but recommended)
    await prisma.refreshToken.delete({ where: { id: existing.id } });
    const newRefreshToken = await generateRefreshToken(existing.user.id);

    const res = NextResponse.json(
        { accessToken },
        { status: HttpStatus.OK }
    );

    // set new refresh token in cookie
    res.cookies.set(REFRESH_TOKEN_NAME, newRefreshToken, ResponseCookieOptions);

    return res;
});
