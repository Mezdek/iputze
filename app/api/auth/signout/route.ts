import { HttpStatus, prisma, SESSION_COOKIE_KEY, withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(async (req: NextRequest) => {
    const sessionId = req.cookies.get(SESSION_COOKIE_KEY)?.value;

    await prisma.session.delete({ where: { id: sessionId } });

    const res = NextResponse.json(null, { status: HttpStatus.OK });

    res.cookies.set(SESSION_COOKIE_KEY, "", { maxAge: 0 });

    return res;
});
