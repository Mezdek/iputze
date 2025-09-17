import { AssignmentErrors, GeneralErrors } from "@constants";
import { getAssignmentOrThrow, getHotelOrThrow, getUserOrThrow, isAdmin, isHotelManager } from "@helpers";
import { APP_ERRORS, prisma } from "@lib";
import { AssignmentNoteCollectionParams } from "@lib/types";
import { Assignment, Role } from "@prisma/client";
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

    if (!assignment.room) throw APP_ERRORS.badRequest(AssignmentErrors.ASSIGNMENT_FLOATING);
    if (assignment.room.hotelId !== hotelId) throw APP_ERRORS.badRequest(AssignmentErrors.ASSIGNMENT_NOT_IN_HOTEL);

    const { roles, id: userId } = await getUserOrThrow(req);

    const isAdminFlag = isAdmin({ roles });
    const isManagerFlag = isHotelManager({ roles, hotelId });

    if (isAdminFlag || isManagerFlag) {
        return {
            hotelId,
            assignmentId,
            userId,
            assignment,
            isAdmin: isAdminFlag,
            isHotelManager: isManagerFlag,
            isAssignmentCleaner: false,
            roles
        };
    }

    const assignmentUser = await prisma.assignmentUser.findUnique({
        where: { assignmentId_userId: { assignmentId, userId } },
    });

    if (!assignmentUser) {
        throw APP_ERRORS.forbidden(GeneralErrors.INSUFFICIENT_AUTHORITY);
    }

    return {
        hotelId,
        assignmentId,
        userId,
        assignment,
        isAdmin: false,
        isHotelManager: false,
        isAssignmentCleaner: true,
        roles
    };
};



export type AssignmentAccessContext = {
    hotelId: number;
    assignmentId: number;
    userId: number;
    assignment: Assignment,
    isAdmin: boolean,
    isHotelManager: boolean,
    isAssignmentCleaner: boolean;
    roles: Role[]
};



