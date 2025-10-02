
import { APP_ERRORS, AuthErrors, checkRateLimit, HttpStatus, RATE_LIMIT_KEYS, validateRegistration, withErrorHandling } from "@lib";
import { prisma } from "@lib/prisma";
import { hash } from "bcrypt";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import type { SignUpRequestBody, SignUpResponse } from "@/types";


export const POST = withErrorHandling(
    async (req: NextRequest) => {

        checkRateLimit(req, RATE_LIMIT_KEYS.REGISTER, 3, 600000);

        const data = (await req.json()) as SignUpRequestBody;

        const { name, email, password } = validateRegistration(data);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw APP_ERRORS.conflict(AuthErrors.DUPLICATED_USER);

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