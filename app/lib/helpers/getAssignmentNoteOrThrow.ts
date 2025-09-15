import { AssignmentErrors, AssignmentNotesErrors } from "@/lib/constants";
import { parseId } from "@/lib/helpers";
import { APP_ERRORS, prisma } from "@lib";
import type { Assignment, AssignmentNote, Hotel, Room } from "@prisma/client";

/**
 * Type that includes an AssignmentNote with its assignment,
 * room, and hotel context for validation purposes.
 */
export type AssignmentNoteWithContext = AssignmentNote & {
    assignment: Assignment & {
        room: Room & {
            hotel: Hotel;
        };
    };
};

/**
 * Parameters for validating an assignment note.
 */
export type AssignmentNoteContext = {
    assignmentNoteIdParam: string;
    expectedAssignmentId?: number;
    expectedHotelId?: number;
    expectedAuthorId?: number;
};

/**
 * Retrieves an assignmentNote by ID and validates its context.
 *
 * Validation includes:
 * - Existence of the assignmentNote.
 * - Correct assignment (if `expectedAssignmentId` is provided).
 * - Correct hotel (if `expectedHotelId` is provided).
 * - Correct author (if `expectedAuthorId` is provided).
 * - Ensures the note belongs to a non-floating assignment (linked to a room).
 *
 * @param ctx - Context parameters for validation.
 * @returns The validated AssignmentNote with assignment, room, and hotel.
 * @throws {HttpError} If validation fails.
 */
export const getAssignmentNoteOrThrow = async (
    ctx: AssignmentNoteContext
): Promise<AssignmentNoteWithContext> => {
    const { assignmentNoteIdParam, expectedAssignmentId, expectedHotelId, expectedAuthorId } = ctx;

    // Parse ID
    const assignmentNoteId = parseId(
        assignmentNoteIdParam,
        AssignmentNotesErrors.ASSIGNMENTNOTE_ID_NOT_VALID
    );

    // Fetch note with full context
    const assignmentNote = await prisma.assignmentNote.findUnique({
        where: { id: assignmentNoteId },
        include: {
            assignment: {
                select: {
                    id: true,
                    room: {
                        select: {
                            id: true,
                            hotel: true,
                        },
                    },
                },
            },
        },
    });

    if (!assignmentNote) {
        throw APP_ERRORS.badRequest(AssignmentNotesErrors.ASSIGNMENTNOTE_NOT_FOUND);
    }

    // Ensure assignment is not floating (must be tied to a room)
    if (!assignmentNote.assignment.room) throw APP_ERRORS.badRequest(AssignmentErrors.ASSIGNMENT_FLOATING);

    // Check assignment match
    if (
        expectedAssignmentId &&
        assignmentNote.assignment.id !== expectedAssignmentId
    ) throw APP_ERRORS.forbidden(
        AssignmentNotesErrors.ASSIGNMENTNOTE_NOT_IN_ASSIGNMENT
    );

    // Check hotel match
    if (
        expectedHotelId &&
        assignmentNote.assignment.room.hotel.id !== expectedHotelId
    ) throw APP_ERRORS.forbidden(
        AssignmentNotesErrors.ASSIGNMENTNOTE_NOT_IN_HOTEL
    );


    // Check author match
    if (expectedAuthorId && assignmentNote.authorId !== expectedAuthorId) throw APP_ERRORS.forbidden(AssignmentNotesErrors.EDITING_NOT_ALLOWED);


    return assignmentNote as AssignmentNoteWithContext;
};
