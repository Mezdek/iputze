import { HttpStatus } from "@constants";
import { getAuthContext } from "@helpers";
import { withErrorHandling } from "@lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(
    async (req: NextRequest) => {
        const auth = await getAuthContext(req);
        return NextResponse.json(
            { ...auth },
            { status: HttpStatus.OK }
        );
    }
)
