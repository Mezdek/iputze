import { AuthErrors, HttpStatus, RateLimitKeys, SESSION_COOKIE_NAMES } from "@constants";
import { APP_ERRORS, checkRateLimit, prisma, withErrorHandling } from "@lib";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(
    async (req: NextRequest) => {

        checkRateLimit(req, RateLimitKeys.SIGNIN, 5, 300000); // 5 attempts per 5 minutes

        const { email, password } = await req.json();

        if (!email || !password) {
            throw APP_ERRORS.badRequest(AuthErrors.INVALID_CREDENTIALS);
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            throw APP_ERRORS.unauthorized();
        }

        // Verify password
        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
            throw APP_ERRORS.unauthorized();
        }

        // Create session
        const sessionToken = randomUUID();
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // e.g. 7 days

        await prisma.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expires,
            },
        });

        // Set cookie
        const store = await cookies();
        const cookieName = SESSION_COOKIE_NAMES[0];
        store.set(cookieName, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
            path: "/",
        });

        // Return success with minimal user info
        return NextResponse.json(
            { id: user.id, email: user.email, name: user.name, sessionToken },
            { status: HttpStatus.OK }
        );
    }
)