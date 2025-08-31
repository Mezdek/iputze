import { CustomErrorMessages, HttpStatus } from "@constants/httpResponses";
import { SESSION_COOKIE_NAMES } from "@constants/session";
import { HttpError } from "@lib/errors/HttpError";
import { APP_ERRORS } from "@lib/errors/factories";
import { prisma } from "@lib/prisma";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface SignInRequest {
    email: string;
    password: string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = (await req.json()) as SignInRequest;

        if (!email || !password) {
            throw APP_ERRORS.badRequest(CustomErrorMessages.INVALID_CREDENTIALS);
        }

        // 1️⃣ Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            throw APP_ERRORS.unauthorized();
        }

        // 2️⃣ Verify password
        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
            throw APP_ERRORS.unauthorized();
        }

        // 3️⃣ Create session
        const sessionToken = randomUUID();
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // e.g. 7 days

        await prisma.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expires,
            },
        });

        // 4️⃣ Set cookie
        const store = await cookies();
        const cookieName = SESSION_COOKIE_NAMES[0]; // e.g. "__Secure-next-auth.session-token"
        store.set(cookieName, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
            path: "/",
        });

        // 5️⃣ Return success with minimal user info
        return NextResponse.json(
            { id: user.id, email: user.email, name: user.name },
            { status: HttpStatus.OK }
        );
    } catch (error) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }

        console.error(error);
        return APP_ERRORS.internalServerError(
            CustomErrorMessages.UNEXPECTED_SERVER_ERROR
        ).nextResponse();
    }
}
