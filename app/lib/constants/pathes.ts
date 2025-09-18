
type getPathProps = { hotelId?: string | number, roomId?: string | number, roleId?: string | number };

export const getPath = (props?: getPathProps) => {
    return ({
        API: {
            SIGNIN: "auth/signin",
            SIGNUP: "auth/signup",
            SIGNOUT: "auth/signout",
            ME: "auth/me",
            HOTELS: "hotels/",
            HOTEL: `hotels/${props?.hotelId}`,
            ROOMS: `hotels/${props?.hotelId}/rooms`,
            ROOM: `hotels/${props?.hotelId}/rooms/${props?.roomId}`,
            ROLES: `hotels/${props?.hotelId}/roles`,
            ROLE: `hotels/${props?.hotelId}/roles/${props?.roleId}`,
        },
        DASHBOARD: "dashboard",
        HOME: "/"
    })
}