import { AssignmentStatus, RoomCleanliness, RoomOccupancy } from "@prisma/client";

type Props = { dateTime: string | number | Date; locale?: Intl.Locale; options?: Intl.DateTimeFormatOptions };

export const nextStatus: Record<AssignmentStatus, AssignmentStatus | null> = {
    [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
    [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.DONE,
    [AssignmentStatus.DONE]: null,
};

export const sections = {
    ASSIGNMENTS: "Assignments",
    ROOMS: "Rooms",
    WORKERS: "Workers",
} as const;

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

export const statusString: Record<AssignmentStatus, Record<"state" | "button", string>> = {
    DONE: { button: "", state: "Done" },
    IN_PROGRESS: { button: "Finish", state: "In progress" },
    PENDING: { button: "Start", state: "Pending" }
}



export const RoomCleanlinessText: Record<RoomCleanliness, string> = {
    [RoomCleanliness.CLEAN]: "Clean",
    [RoomCleanliness.DIRTY]: "Dirty"
};

export const RoomOccupancyText: Record<RoomOccupancy, string> = {
    [RoomOccupancy.AVAILABLE]: "Available",
    [RoomOccupancy.OCCUPIED]: "Occupied"
}
