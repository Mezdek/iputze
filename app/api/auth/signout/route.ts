import { HttpStatus, prisma, ResponseCookieOptions, SESSION_COOKIE_KEY, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(async (req: NextRequest) => {
    const sessionId = req.cookies.get(SESSION_COOKIE_KEY)?.value;

    if (sessionId) {
        await prisma.session.delete({
            where: { id: sessionId }
        }).catch((error) => {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Session deletion failed:', error.message);
            }
        });
    }

    const res = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: HttpStatus.OK }
    );

    res.cookies.set(SESSION_COOKIE_KEY, "", {
        ...ResponseCookieOptions,
        maxAge: 0
    });

    return res;
});