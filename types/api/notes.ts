import type { TaskParams } from '@/types';

export interface NoteCreationBody {
  content: string;
}

export type NoteCollectionParams = TaskParams;
export type NoteParams = NoteCollectionParams & {
  noteId: string;
};
