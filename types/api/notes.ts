import type { AssignmentParams } from '@/types';

export interface AssignmentNoteCreationBody {
  content: string;
}
export interface AssignmentNoteUpdateBody {
  content: string;
}

export type AssignmentNoteCollectionParams = AssignmentParams;
export type AssignmentNoteParams = AssignmentNoteCollectionParams & {
  assignmentNoteId: string;
};
