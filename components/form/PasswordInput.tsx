'use client'

import { Input } from "@heroui/react";
import { useState } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";

type PasswordInputProps = { formId?: string, name?: string, label?: string, placeholder?: string, autoComplete?: "new-password" | "current-password" }

export function PasswordInput(props: PasswordInputProps) {
    const { formId = "", name = "password", label = "Password", placeholder = "Enter your password", autoComplete } = props
    const [isVisible, setIsVisible] = useState<boolean>(false);
    return (
        <Input
            autoComplete={autoComplete}
            form={formId}
            isRequired
            label={label}
            name={name}
            placeholder={placeholder}
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