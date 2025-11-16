import type { ButtonProps, CardProps, FormProps } from '@heroui/react';
import type { FormEvent } from 'react';

import type {
  ApprovalRequestProps,
  MeResponse,
  RoomWithContext,
  RoomWithStatus,
  TaskResponse,
  TRoleWithUser,
} from '@/types';

export interface RoomCardProps {
  room: RoomWithStatus;
  isSelected: boolean;
  onClick: () => void;
}

export interface RoomDeletionProps extends Partial<ApprovalRequestProps> {
  room: RoomWithContext;
}

export interface RoomDetailsCardProps extends CardProps {
  room: RoomWithContext;
  tasks: TaskResponse[];
  user: MeResponse;
}

export enum RoomFormModes {
  CREATION = 'creation',
  UPDATE = 'update',
}

export interface RoomFormProps extends Omit<FormProps, 'onSubmit'> {
  room?: RoomWithContext;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  mode: RoomFormModes;
  cleaners: TRoleWithUser[];
}

export const ROOM_TYPES = [
  'Single',
  'Double',
  'Suite',
  'Standard',
  'Deluxe',
] as const;

export interface RoomUpdateProps extends ButtonProps {
  room: RoomWithContext;
  isIconOnly?: boolean;
}
