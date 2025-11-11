import * as hotel from './hotelManagement';
import * as role from './roleManagement';
import * as room from './roomManagement';
import * as task from './taskManagement';
import * as util from './utilityPermissions';

export const checkPermission = {
  creation: {
    hotel: hotel.canCreateHotel,
    room: room.canCreateRoom,
    role: role.canCreateRole,
    task: task.canCreateTask,
  },
  modification: {
    hotel: hotel.canModifyHotel,
    room: room.canModifyRoom,
    role: role.canModifyRole,
    task: task.canModifyTask,
  },
  deletion: {
    hotel: hotel.canDeleteHotel,
    room: room.canDeleteRoom,
    task: task.canDeleteTask,
    note: task.canDeleteNote,
  },
  view: {
    hotel: hotel.canViewHotel,
    room: room.canViewRoom,
    role: role.canViewRoles,
    task: task.canViewTasks,
  },
};

const { getRolesByLevel, getAdminRole, ...is } = util;

export const checkRoles = { ...is };
export const getRoles = { byLevel: getRolesByLevel, adminRole: getAdminRole };
