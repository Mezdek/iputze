import { prisma } from "@lib/prisma";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { sign, verify } from "jsonwebtoken";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

/** Environment + defaults (fail fast if secrets missing) */
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP || "15m";
export const REFRESH_TOKEN_EXP = process.env.REFRESH_TOKEN_EXP || "7d";

/** Types for token payloads */
export interface AccessTokenPayload {
    sub: string;    // user id (number)
    email: string;
    iat?: number;
    exp?: number;
}

export interface RefreshTokenPayload {
    sub: number;    // user id (number)
    iat?: number;
    exp?: number;
}

/** tiny helper: convert "15m"/"7d"/"3600" to seconds */
export const parseExpiryToSeconds = (exp: string): number => {
    // numeric string => seconds
    if (/^\d+$/.test(exp)) return Number(exp);

    const m = /^(\d+)([smhd])$/.exec(exp);
    if (!m) {
        // fallback: try ms-like values (not using ms lib). Default 0.
        return 0;
    }
    const n = Number(m[1]);
    const unit = m[2];
    switch (unit) {
        case "s": return n;
        case "m": return n * 60;
        case "h": return n * 60 * 60;
        case "d": return n * 60 * 60 * 24;
        default: return n;
    }
}

/** Generate access token (short-lived) */
export const generateAccessToken = (payload: { sub: string; email: string }): string => {
    return sign(
        { sub: payload.sub, email: payload.email },
        JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXP } as SignOptions
    );
}

/** Generate refresh token, persist in DB and return token string */
export const generateRefreshToken = async (userId: string): Promise<string> => {
    const token = sign({ sub: userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXP } as SignOptions);

    // compute expiresAt from REFRESH_TOKEN_EXP
    const seconds = parseExpiryToSeconds(REFRESH_TOKEN_EXP);
    const expiresAt = new Date(Date.now() + seconds * 1000);

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });

    return token;
}

/** Verify access token and return typed payload (throws on invalid) */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
    const decoded = verify(token, JWT_ACCESS_SECRET) as unknown;

    if (typeof decoded === "string") throw new Error("Invalid access token payload");
    // now decoded is object-like; ensure required fields exist
    const maybe = decoded as JwtPayload;
    if (!maybe.sub || !maybe.email) throw new Error("Access token missing claims");

    // convert sub to number (token might have encoded sub as string)
    const subNum = maybe.sub;
    if (Number.isNaN(subNum)) throw new Error("Invalid sub claim");

    return {
        sub: subNum,
        email: String(maybe.email),
        iat: maybe.iat,
        exp: maybe.exp,
    };

}

/** Verify refresh token: check JWT and DB presence/expiry. Returns payload. */
export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
    // 1) verify signature
    const decoded = verify(token, JWT_REFRESH_SECRET) as unknown;
    if (typeof decoded === "string") throw new Error("Invalid refresh token payload");
    const maybe = decoded as JwtPayload;
    if (!maybe.sub) throw new Error("Refresh token missing sub");

    const subNum = Number(maybe.sub);
    if (Number.isNaN(subNum)) throw new Error("Invalid sub in refresh token");

    // 2) check DB entry exists and not expired
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored) throw new Error("Refresh token not found");
    if (stored.expiresAt < new Date()) {
        // optional: remove expired token
        await prisma.refreshToken.deleteMany({ where: { token } });
        throw new Error("Refresh token expired");
    }

    return { sub: subNum, iat: maybe.iat, exp: maybe.exp };
}

/** Revoke refresh token (delete DB entry) */
export const revokeRefreshToken = async (token: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({ where: { token } });
}

/** Revoke all refresh tokens for user (e.g. logout-all-devices) */
export const revokeUserRefreshTokens = async (userId: string): Promise<void> => {
    await prisma.refreshToken.deleteMany({ where: { userId } });
}


export const ResponseCookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: parseExpiryToSeconds(REFRESH_TOKEN_EXP)
}