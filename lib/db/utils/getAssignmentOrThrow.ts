import { prisma } from '@lib/db';
import { APP_ERRORS, AssignmentErrors } from '@lib/shared';

/**
 * Retrieves an assignment by ID and throws if not found or invalid.
 *
 * @param assignmentIdParam - Raw assignmentId (string or number).
 * @returns The validated hotel entity.
 * @throws {HttpError} If assignmentId is invalid or assignment not found.
 */
export const getAssignmentOrThrow = async (assignmentId: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      room: {
        select: {
          hotelId: true,
        },
      },
      assignedBy: {
        omit: {
          passwordHash: true,
        },
      },
    },
  });

  if (!assignment) throw APP_ERRORS.badRequest(AssignmentErrors.NOT_FOUND);

  return assignment;
};
