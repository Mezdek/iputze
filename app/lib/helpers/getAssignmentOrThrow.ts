import { AssignmentErrors } from "@constants";
import { APP_ERRORS } from "@errors";
import { prisma } from "@lib/prisma";

/**
 * Retrieves an assignment by ID and throws if not found or invalid.
 *
 * @param assignmentIdParam - Raw assignmentId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If assignmentId is invalid or assignment not found.
 */
export const getAssignmentOrThrow = async (assignmentId: string) => {

    const assignment = await prisma.assignment.findUnique(
        {
            where:
            {
                id: assignmentId
            },
            include:
            {
                room:
                {
                    select:
                    {
                        hotelId: true
                    }
                },
                assignedByUser:
                {
                    omit: {
                        passwordHash: true
                    }
                }
            },
        }
    );

    if (!assignment) throw APP_ERRORS.badRequest(AssignmentErrors.NOT_FOUND);

    return assignment;
};



