type getPathProps = { hotelId?: string | number, roomId?: string | number };

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
        },
        DASHBOARD: "dashboard",
        HOME: "/"
    })
}