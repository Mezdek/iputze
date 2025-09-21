import type { AssignmentAccessContext, AssignmentNoteCollectionParams, } from "@apptypes";
import { APP_ERRORS, AssignmentErrors, GeneralErrors, getAssignmentOrThrow, getHotelOrThrow, getUserOrThrow, isAdmin, isHotelManager } from "@lib";
import { prisma } from "@lib/prisma";
import { NextRequest } from "next/server";



export const getAssignmentAccessContext = async ({
    params,
    req,
}: {
    params: AssignmentNoteCollectionParams;
    req: NextRequest;
}): Promise<AssignmentAccessContext> => {

    const hotel = await getHotelOrThrow(params.hotelId);
    const { id: hotelId } = hotel;

    const assignment = await getAssignmentOrThrow(params.assignmentId);
    const { id: assignmentId } = assignment;

    if (assignment.room.hotelId !== hotelId) throw APP_ERRORS.badRequest(AssignmentErrors.NOT_IN_HOTEL);

    const { roles, id: userId } = await getUserOrThrow(req);

    const isAdminFlag = isAdmin({ roles });
    const isManagerFlag = isHotelManager({ roles, hotelId });
    let isAssignmentCleaner = false;

    const returnable = {
        hotelId,
        assignmentId,
        userId,
        assignment,
        roles,
        isAdmin: isAdminFlag,
        isHotelManager: isManagerFlag,
        isAssignmentCleaner,
    }

    if (isAdminFlag || isManagerFlag) return returnable

    const assignmentUser = await prisma.assignmentUser.findUnique({
        where: { assignmentId_userId: { assignmentId, userId } },
    });

    if (!assignmentUser) throw APP_ERRORS.forbidden(GeneralErrors.ACTION_DENIED);

    return { ...returnable, isAssignmentCleaner: !!assignmentUser };
};






