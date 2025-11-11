import type { Note, Role } from '@prisma/client';

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

export interface RawNoteWithContext extends Omit<Note, 'taskId' | 'authorId'> {
  task: {
    id: string;
    room: {
      id: string;
      hotelId: string;
    };
  };
  author: BasicUser;
}

export interface NoteWithContext extends Omit<Note, 'taskId' | 'authorId'> {
  author: BasicUser;
  taskId: string;
  hotelId: string;
  roomId: string;
}

export interface NoteManagement {
  authorId: string;
  userId: string;
  roles?: Role[];
}
