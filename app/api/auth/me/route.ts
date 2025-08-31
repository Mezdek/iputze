// File: src/app/api/auth/me/route.ts

import { HttpStatus } from "@constants/httpResponses";
import { getAuthContext } from "@helpers/getAuthContext";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 1️⃣ Use your helper to load user + roles from session
        const auth = await getAuthContext();

        // 2️⃣ Return all relevant info (roles, avatar, etc.)
        return NextResponse.json(
            { ...auth },
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
