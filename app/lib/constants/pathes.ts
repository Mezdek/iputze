
type getPathProps = {
    hotelId?: string | number,
    roomId?: string | number,
    roleId?: string | number,
    assignmentId?: number | string,
    assignmentNoteId?: number | string
};

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
            ASSIGNMENTS: `hotels/${props?.hotelId}/assignments`,
            ASSIGNMENT: `hotels/${props?.hotelId}/assignments/${props?.assignmentId}`,
            ASSIGNMENTNOTES: `hotels/${props?.hotelId}/assignments/${props?.assignmentId}/assignmentNotes`,
            ASSIGNMENTNOTE: `hotels/${props?.hotelId}/assignments/${props?.assignmentId}/assignmentNotes/${props?.assignmentNoteId}`,

        },
        DASHBOARD: "dashboard",
        HOME: "/",
        HOTELS: "hotels",
    })
}