'use client'

import { Input } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icons";

type PasswordInputProps = { formId?: string, name?: string, autoComplete?: "new-password" | "current-password" }

export function PasswordInput(props: PasswordInputProps) {
    const t = useTranslations("login");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const locale = useLocale();

    const className = locale === "ar" ? "placeholder-rtl" : ""

    return (
        <Input
            dir="ltr"
            className={className}
            autoComplete={props.autoComplete}
            form={props.formId}
            isRequired
            label={t("password_input.label")}
            name={props.name || "password"}
            placeholder={t("password_input.placeholder")}
            type={isVisible ? "text" : "password"}
            endContent={
                <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    onClick={() => setIsVisible(!isVisible)}
                    type="button"
                >
                    {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
        />
    );
}