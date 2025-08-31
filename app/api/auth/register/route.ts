// File: src/app/api/auth/register/route.ts

import { HttpStatus } from "@constants/httpResponses";
import { APP_ERRORS } from "@lib/errors/factories";
import { HttpError } from "@lib/errors/HttpError";
import { prisma } from "@lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    hotelName: string;
}

export async function POST(req: Request) {
    try {
        const data = (await req.json()) as RegisterRequest;

        if (!data.name || !data.email || !data.password || !data.hotelName) {
            throw APP_ERRORS.badRequest("All fields are required");
        }

        // 1️⃣ Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw APP_ERRORS.conflict("User already exists");
        }

        // 2️⃣ Create Hotel (or reuse existing one if unique constraint should apply)
        let hotel = await prisma.hotel.findUnique({ where: { name: data.hotelName } });
        if (!hotel) {
            hotel = await prisma.hotel.create({
                data: { name: data.hotelName },
            });
        }

        // 3️⃣ Hash password
        const passwordHash = await hash(data.password, 10);

        // 4️⃣ Create User
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
            },
        });

        // 5️⃣ Assign role
        await prisma.role.create({
            data: {
                userId: user.id,
                hotelId: hotel.id,
                level: "PENDING",
                status: "ACTIVE",
            },
        });

        return NextResponse.json(
            { id: user.id, email: user.email, name: user.name },
            { status: HttpStatus.CREATED }
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
