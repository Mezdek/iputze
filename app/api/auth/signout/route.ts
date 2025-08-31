// File: src/app/api/auth/signout/route.ts

import { HttpStatus } from "@constants/httpResponses";
import { getSessionToken } from "@helpers/getSessionToken";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const sessionToken = await getSessionToken();

        // 1️⃣ Delete session in DB
        await prisma.session.deleteMany({ where: { sessionToken } });

        // 2️⃣ Clear cookie
        const cookieStore = await cookies();
        cookieStore.set("next-auth.session-token", "", { maxAge: 0, path: "/" });
        cookieStore.set("__Secure-next-auth.session-token", "", { maxAge: 0, path: "/" });

        return NextResponse.json(
            { message: "Signed out successfully" },
            { status: HttpStatus.OK }
        );
    } catch (error: unknown) {
        if (error instanceof HttpError) {
            console.error(error);
            return error.nextResponse();
        }
        console.error(error);
        return APP_ERRORS.internalServerError().nextResponse();
    }
}
