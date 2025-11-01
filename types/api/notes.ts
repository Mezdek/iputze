import type { Note } from '@prisma/client';

import type { BasicUser, TaskParams } from '@/types';

export type NoteCreationBody = {
  content: string;
};

export type NoteCollectionParams = TaskParams;
export type NoteParams = NoteCollectionParams & {
  noteId: string;
};

export interface NoteWithAuthor extends Note {
  author: BasicUser;
}
