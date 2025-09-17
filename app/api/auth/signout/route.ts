import { HttpStatus, REFRESH_TOKEN_NAME } from "@constants";
import { withErrorHandling } from "@errors";
import { ResponseCookieOptions, revokeRefreshToken } from "@helpers";
import { NextResponse } from "next/server";

export const POST = withErrorHandling(async (req) => {
    const cookie = req.cookies.get(REFRESH_TOKEN_NAME);

    if (cookie?.value) await revokeRefreshToken(cookie.value);

    const res = NextResponse.json({ message: "Signed out" }, { status: HttpStatus.OK });

    res.cookies.set(REFRESH_TOKEN_NAME, "", { ...ResponseCookieOptions, maxAge: 0 });

    return res;
});
