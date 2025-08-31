export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,//When API depends on another service and it fails.
}

export const DefaultMessages: Record<HttpStatus, string> = {
    [HttpStatus.OK]: "OK",
    [HttpStatus.CREATED]: "Created",
    [HttpStatus.NO_CONTENT]: "No Content",
    [HttpStatus.BAD_REQUEST]: "Bad Request",
    [HttpStatus.UNAUTHORIZED]: "Unauthorized",
    [HttpStatus.FORBIDDEN]: "Forbidden",
    [HttpStatus.NOT_FOUND]: "Not Found",
    [HttpStatus.METHOD_NOT_ALLOWED]: "Method Not Allowed",
    [HttpStatus.CONFLICT]: "Conflict",
    [HttpStatus.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
    [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
    [HttpStatus.BAD_GATEWAY]: "Bad Gateway",
};



export enum CustomErrorMessages {
    // General
    MISSING_PARAMETERS = "Missing Required Parameters",
    // Auth
    INVALID_CREDENTIALS = "Invalid Credentials",
    INVALID_ID = "Please Provide A Valid ID",
    NO_SESSION = "No Valid Session Is Found",
    USER_NOT_FOUND = "User Not Found",
    // Roles
    ROLE_NOT_FOUND = "Role Not Found",
    ROLE_MODIFICATION_NOT_ALLOWED = "Modifying Role Not Allowed",
    // Rooms
    NO_ROOM_FOUND = "No Room Found",
    ROOM_ID_NOT_VALID = "Room ID Not Valid",
    ROOM_NUMBER_ALREADY_EXISTS = "Room Number Already Exists",
    ROOM_NUMBER_REQUIRED = "Room Number Is Required",
    ROOM_NOT_FOUND = "Room Not Found",
    // Hotels
    HOTEL_ID_NOT_VALID = "Hotel ID Not Valid",
    HOTEL_NOT_FOUND = "Hotel Not Found",
    NO_HOTEL_FOUND = "No Hotel Found",
    HOTEL_NAME_REQUIRED = "Hotel Name Is Required",
    // General
    UNEXPECTED_SERVER_ERROR = "Unexpected Server Error",
}

export enum CustomSuccessMessages {
    // Rooms
    ROOM_DELETED_SUCCESSFULLY = "Room Deleted Successfully",
    // Hotels
    HOTEL_DELETED_SUCCESSFULLY = "Hotel Deleted Successfully"
}



