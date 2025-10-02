export class ApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public readonly response?: Response;
    public readonly data?: unknown;

    constructor(response: Response, data?: unknown) {
        const message = `API Error: ${response.status} ${response.statusText}`;
        super(message);

        this.name = 'ApiError';
        this.status = response.status;
        this.statusText = response.statusText;
        this.url = response.url;
        this.response = response;
        this.data = data;

        // Maintains proper stack trace for where error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    isServerError(): boolean {
        return this.status >= 500;
    }

    isBadRequest(): boolean {
        return this.status === 400;
    }

    isUnauthorized(): boolean {
        return this.status === 401;
    }

    isForbidden(): boolean {
        return this.status === 403;
    }

    isNotFound(): boolean {
        return this.status === 404;
    }

    isConflict(): boolean {
        return this.status === 409;
    }

    static async fromResponse(response: Response): Promise<ApiError> {
        let data;
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : undefined;
        } catch {
            // Ignore parsing errors
        }

        return new ApiError(response, data);
    }
}