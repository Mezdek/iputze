import { RegisterRequest } from "@/types";
import { AuthErrors, HttpStatus, RateLimitKeys } from "@constants";
import { validateRegistration } from "@helpers";
import { APP_ERRORS, checkRateLimit, prisma, withErrorHandling } from "@lib";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(
    async (req: NextRequest) => {

        checkRateLimit(req, RateLimitKeys.REGISTER, 3, 600000);

        const data = (await req.json()) as RegisterRequest;

        const { name, email, password } = validateRegistration(data);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw APP_ERRORS.conflict(AuthErrors.USER_ALREADY_EXISTS);
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

        return NextResponse.json(
            { id: user.id, email: user.email, name: user.name },
            { status: HttpStatus.CREATED }
        );
    }
)
