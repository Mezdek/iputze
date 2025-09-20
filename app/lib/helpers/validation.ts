import { AuthErrors } from "@constants";
import { APP_ERRORS } from "@errors";
import { z } from "zod";

/**
 * Schemas
 */
export const nameSchema = z.string().min(1).max(255).trim();
export const emailSchema = z.string().email().max(255);
export const passwordSchema = z.string().min(8).max(128);

/**
 * Generic validator for registration
 */
export const validateRegistration = (data: unknown) => {
    const result = z
        .object({
            name: nameSchema,
            email: emailSchema,
            password: passwordSchema,
        })
        .safeParse(data);

    if (!result.success) {
        throw APP_ERRORS.badRequest(AuthErrors.INVALID_VALUES);
    }

    return result.data;
};
