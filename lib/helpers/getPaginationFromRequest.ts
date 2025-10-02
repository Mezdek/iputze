import type { NextRequest } from "next/server";

export interface ParsedPagination {
    page: number;
    pageSize: number;
    skip: number;
    take: number;
}

/**
 * Parses pagination query params from a NextRequest.
 * Defaults: page=1, pageSize=20. Caps pageSize at maxPageSize (default 100).
 */
export const getPaginationFromRequest = (req: NextRequest, maxPageSize = 100): ParsedPagination => {
    const url = new URL(req.url);
    const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") || 20), maxPageSize);

    return {
        page,
        pageSize,
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
};