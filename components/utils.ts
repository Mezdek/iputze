import { AssignmentStatus, RoomCleanliness, RoomOccupancy } from "@prisma/client";


export const nextStatus = {
    [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
    [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.DONE,
    [AssignmentStatus.DONE]: null,
} as const;

export const sections = {
    ASSIGNMENTS: "Assignments",
    ROOMS: "Rooms",
    WORKERS: "Workers",
} as const;

export const statusString = {
    DONE: { button: "", state: "done" },
    IN_PROGRESS: { button: "finish", state: "in_progress" },
    PENDING: { button: "start", state: "pending" }
} as const;

export const RoomCleanlinessText = {
    [RoomCleanliness.CLEAN]: "Clean",
    [RoomCleanliness.DIRTY]: "Dirty"
} as const;

export const RoomOccupancyText = {
    [RoomOccupancy.AVAILABLE]: "Available",
    [RoomOccupancy.OCCUPIED]: "Occupied"
} as const;

type Props = { dateTime: string | number | Date; locale?: Intl.Locale; options?: Intl.DateTimeFormatOptions };

export function dateAndTime({ dateTime, locale, options }: Props) {
    const parsedOtions: Intl.DateTimeFormatOptions = {
        hour12: false,
        minute: "numeric",
        hour: "numeric",
        hourCycle: "h23",
        day: "numeric",
        weekday: "long",
        month: "short",
        ...options
    };
    return new Date(dateTime).toLocaleDateString(locale ?? "de-DE", parsedOtions);
}

