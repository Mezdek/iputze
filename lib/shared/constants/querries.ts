export const queryKeys = {
  me: ['me'] as const,
  hotels: ['hotels'] as const,
  rooms: (hotelId: string) => ['rooms', hotelId] as const,
  room: (hotelId: string, roomId: string) =>
    ['rooms', hotelId, roomId] as const,
  roles: (hotelId: string) => ['roles', hotelId] as const,
  role: (hotelId: string, roleId: string) =>
    ['roles', hotelId, roleId] as const,
  tasks: (hotelId: string) => ['tasks', hotelId] as const,
  task: (hotelId: string, taskId: string) =>
    ['tasks', hotelId, taskId] as const,
  taskNotes: (hotelId: string, taskId: string) =>
    ['tasks', hotelId, taskId, 'notes'] as const,
  taskImages: (hotelId: string, taskId: string) =>
    ['tasks', hotelId, taskId, 'images'] as const,
} as const;

export const STALE_TIME = {
  REALTIME: 0, // Always refetch on mount/focus
  FREQUENT: 30 * 60 * 1000, // 30 minutes - tasks, notes, images
  STABLE: 24 * 60 * 60 * 1000, // 24 hours - rooms, hotels, roles
} as const;
