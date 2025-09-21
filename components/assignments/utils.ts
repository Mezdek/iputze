import { AssignmentStatus } from "@prisma/client";

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

export const statusString: Record<AssignmentStatus, string> = {
    DONE: "done",
    IN_PROGRESS: "in progress",
    PENDING: "pending"
}