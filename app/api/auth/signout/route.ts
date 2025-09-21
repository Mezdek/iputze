import { HttpStatus, REFRESH_TOKEN_NAME, ResponseCookieOptions, revokeRefreshToken, withErrorHandling } from "@lib";
import { NextResponse } from "next/server";

export const POST = withErrorHandling(async (req) => {
    const cookie = req.cookies.get(REFRESH_TOKEN_NAME);

    if (cookie?.value) await revokeRefreshToken(cookie.value);

    const res = NextResponse.json(null, { status: HttpStatus.NO_CONTENT });

    res.cookies.set(REFRESH_TOKEN_NAME, "", { ...ResponseCookieOptions, maxAge: 0 });

    return res;
});
