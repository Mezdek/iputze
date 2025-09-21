import type { SignUpRequestBody, SignUpResponse } from "@apptypes";
import { APP_ERRORS, AuthErrors, checkRateLimit, HttpStatus, RateLimitKeys, validateRegistration, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(
    async (req: NextRequest) => {

        checkRateLimit(req, RateLimitKeys.REGISTER, 3, 600000);

        const data = (await req.json()) as SignUpRequestBody;

        const { name, email, password } = validateRegistration(data);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw APP_ERRORS.conflict(AuthErrors.DUPLICATED_USER);
        }

        // Hash password
        const passwordHash = await hash(password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

        return NextResponse.json<SignUpResponse>(
            { id: user.id, email: user.email, name: user.name },
            { status: HttpStatus.CREATED }
        );
    }
)