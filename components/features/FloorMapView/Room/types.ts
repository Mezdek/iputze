import type { ButtonProps, CardProps, FormProps } from '@heroui/react';
import type { Room, User } from '@prisma/client';
import type { FormEvent } from 'react';

import type { ApprovalRequestProps } from '@/components';
import type {
  RoomParams,
  RoomWithHotel,
  RoomWithStatus,
  TaskResponse,
} from '@/types';

export interface RoomCardProps {
  room: RoomWithStatus;
  isSelected: boolean;
  onClick: () => void;
}

export interface RoomDeletionProps extends ApprovalRequestProps, RoomParams {
  roomNumber: string;
}

export interface RoomDetailsCardProps extends CardProps {
  room: RoomWithHotel;
  tasks: TaskResponse[];
  defaultCleaners: {
    user: User;
  }[];
}

export enum RoomFormModes {
  CREATION = 'creation',
  UPDATE = 'update',
}

export interface RoomFormProps extends Omit<FormProps, 'onSubmit'> {
  room?: Room;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  mode: RoomFormModes;
}

export const ROOM_TYPES = [
  'Single',
  'Double',
  'Suite',
  'Standard',
  'Deluxe',
] as const;

export interface RoomUpdateProps extends ButtonProps {
  room: Room;
  isIconOnly?: boolean;
}
