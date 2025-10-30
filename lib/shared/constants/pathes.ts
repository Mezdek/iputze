type getPathProps = {
  hotelId?: number | string | undefined;
  roomId?: number | string | undefined;
  roleId?: number | string | undefined;
  taskId?: number | string | undefined;
  noteId?: number | string | undefined;
  imageId?: number | string | undefined;
};

export const getPath = (props?: getPathProps) => {
  return {
    API: {
      SIGNIN: '/auth/signin',
      SIGNUP: '/auth/signup',
      SIGNOUT: '/auth/signout',
      ME: '/auth/me',
      HOTELS: '/hotels/',
      HOTEL: `/hotels/${props?.hotelId}`,
      ROOMS: `/hotels/${props?.hotelId}/rooms`,
      ROOM: `/hotels/${props?.hotelId}/rooms/${props?.roomId}`,
      ROLES: `/hotels/${props?.hotelId}/roles`,
      ROLE: `/hotels/${props?.hotelId}/roles/${props?.roleId}`,
      TASKS: `/hotels/${props?.hotelId}/tasks`,
      TASK: `/hotels/${props?.hotelId}/tasks/${props?.taskId}`,
      NOTES: `/hotels/${props?.hotelId}/tasks/${props?.taskId}/notes`,
      NOTE: `/hotels/${props?.hotelId}/tasks/${props?.taskId}/notes/${props?.noteId}`,
      IMAGES: `/hotels/${props?.hotelId}/tasks/${props?.taskId}/notes`,
      IMAGE: `/hotels/${props?.hotelId}/tasks/${props?.taskId}/notes/${props?.imageId}`,
      LOCALE: '/set-locale',
    },
    DASHBOARD: '/dashboard',
    HOME: '/',
    HOTELS: '/hotels',
    HOTEL: `/hotels/${props?.hotelId}`,
  };
};
