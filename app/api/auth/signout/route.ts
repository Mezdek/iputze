import { AuthErrors, CustomSuccessMessages, HttpStatus, SESSION_COOKIE_NAMES } from "@/lib/constants";
import { getSessionToken } from "@/lib/helpers";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(
    async (req: NextRequest) => {

        const sessionToken = await getSessionToken(req);

        // Delete session in DB
        const sessions = await prisma.session.deleteMany({ where: { sessionToken } });
        if (sessions.count < 1) throw APP_ERRORS.badRequest(AuthErrors.INVALID_SESSION);

        // Clear all session cookies
        const cookieStore = await cookies();
        SESSION_COOKIE_NAMES.forEach(name => {
            cookieStore.set(name, "", { maxAge: 0, path: "/" });
        });

        return NextResponse.json({
            status: HttpStatus.NO_CONTENT,
            message: CustomSuccessMessages.SESSION_TERMINATED,
        });
    }
)