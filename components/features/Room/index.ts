import { Nav } from './Nav';
import { RoomCreation } from './RoomCreation';
import { RoomDeletion } from './RoomDeletion';
import { RoomDetails } from './RoomDetails';
import { RoomInfo } from './RoomInfo';
import { RoomsMap } from './RoomsMap';
import { RoomUpdate } from './RoomUpdate';
import { roomStatus, StatusBar, type TRoomStatus } from './StatusBar';
import { TaskDetails } from './TaskDetails';
import { TaskManagement } from './TaskManagement';
import { TasksOverview } from './TaskOverview';
import { TasksList } from './TasksList';

const Room = {
  RoomInfo,
  StatusBar,
  TaskDetails,
  TaskManagement,
  TasksOverview,
  TasksList,
  RoomsMap,
  RoomUpdate,
  RoomDeletion,
  RoomCreation,
  Nav,
  roomStatus,
};
export { Room, RoomDetails };
export type { TRoomStatus };
