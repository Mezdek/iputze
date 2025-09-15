import { AssignmentErrors } from "@/lib/constants";
import { parseId } from "@/lib/helpers";
import { APP_ERRORS, prisma } from "@lib";

/**
 * Retrieves an assignment by ID and throws if not found or invalid.
 *
 * @param assignmentIdParam - Raw assignmentId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If assignmentId is invalid or assignment not found.
 */
export const getAssignmentOrThrow = async (assignmentIdParam: string) => {
    const assignmentId = parseId(assignmentIdParam, AssignmentErrors.ASSIGNMENT_ID_NOT_VALID);

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }, include: { room: { select: { hotelId: true } } }, });

    if (!assignment) throw APP_ERRORS.badRequest(AssignmentErrors.ASSIGNMENT_NOT_FOUND);

    return assignment;
};



