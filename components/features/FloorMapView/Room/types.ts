import type { RoomWithStatus } from '@/types';

export interface RoomCardProps {
  room: RoomWithStatus;
  isSelected: boolean;
  onClick: () => void;
}
