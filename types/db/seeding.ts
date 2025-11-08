import type { RoleLevel } from '@prisma/client';

import type { RoomCreationBody, TaskCreationBody } from '@/types';

export interface TSEEDING_RoomCreation
  extends Omit<RoomCreationBody, 'defaultCleanersIds'> {
  defaultCleanersEmails: string[];
}

export interface TSEEDING_Task extends Omit<TaskCreationBody, 'roomId'> {
  roomNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TSEEDING_User {
  email: string;
  level: RoleLevel;
  name: string;
  password: string;
  avatarUrl?: string;
}
