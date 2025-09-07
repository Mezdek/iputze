import { RegisterRequest } from "@/types";
import { AuthErrors, HttpStatus } from "@constants";
import { APP_ERRORS, prisma, withErrorHandling } from "@lib";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandling(
    async (req: NextRequest) => {
        const data: RegisterRequest = await req.json()

        if (!data.name || !data.email || !data.password) {
            throw APP_ERRORS.badRequest(AuthErrors.ALL_FIELDS_REQUIRED);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw APP_ERRORS.conflict(AuthErrors.USER_ALREADY_EXISTS);
        }

        // Hash password
        const passwordHash = await hash(data.password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
            },
        });

        return NextResponse.json(
            { id: user.id, email: user.email, name: user.name },
            { status: HttpStatus.CREATED }
        );
    }
)
