import { addToast } from "@heroui/react";
import { ClientError, ErrorCodes } from "@lib";
import { useTranslations } from "next-intl";

export function useErrorToast() {
    const t = useTranslations();

    const showErrorToast = (err: unknown) => {
        if (err instanceof ClientError) {
            const msg = ErrorCodes[err.context];
            //@ts-expect-error
            const title = t(`${err.context}.errors.${err.code}.title`)
            //@ts-expect-error
            const description = t(`${err.context}.errors.${err.code}.description`)
            if (msg) {
                addToast({ title, description, color: "danger" });
                return;
            }
        }
        addToast({
            title: "Unexpected error",
            description: "Please try again later",
            color: "danger",
        });
    };

    return { showErrorToast }
}