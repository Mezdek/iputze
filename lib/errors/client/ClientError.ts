import { LeafValues } from "@/types";
import { ErrorCodes } from ".";

export type ErrorCodeMap<T> = {
    [K in keyof T]: LeafValues<T[K]>;
};

export type ErrorCodeByContext = ErrorCodeMap<typeof ErrorCodes>;

export type Context = keyof ErrorCodeByContext

type ErrorCode = LeafValues<typeof ErrorCodes>;

export class ClientError extends Error {

    context: Context;
    code: ErrorCodeByContext[Context];
    originalError?: unknown;

    constructor(context: Context, code: ErrorCodeByContext[Context], originalError?: unknown, message?: string) {
        super(message ?? code);
        this.name = "ClientError";
        this.context = context;
        this.code = code;
        this.originalError = originalError;

        Object.setPrototypeOf(this, ClientError.prototype);
    }
}



