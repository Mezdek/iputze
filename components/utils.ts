import { AssignmentStatus } from "@prisma/client";


export const NEXT_STATUS = {
    [AssignmentStatus.PENDING]: AssignmentStatus.IN_PROGRESS,
    [AssignmentStatus.IN_PROGRESS]: AssignmentStatus.DONE,
    [AssignmentStatus.DONE]: null,
} as const;

export const SECTIONS = {
    ASSIGNMENTS: "Assignments",
    ROOMS: "Rooms",
    WORKERS: "Workers",
} as const;

export const STATUS_STRING = {
    DONE: { button: "", state: "done" },
    IN_PROGRESS: { button: "finish", state: "in_progress" },
    PENDING: { button: "start", state: "pending" }
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

