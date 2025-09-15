"use client";

import { EyeFilledIcon, EyeSlashFilledIcon } from "@components/icons";
import { PAGES, ROUTES } from "@constants";
import { Button, Form, Input } from "@heroui/react";
import { useSignIn } from "@hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInForm() {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [apiError, setApiError] = useState("");

    const { mutate: signIn, isPending } = useSignIn();

    const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setApiError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get(PAGES.SIGNIN.INPUTS.EMAIL.NAME) as string;
        const password = formData.get(PAGES.SIGNIN.INPUTS.PASSWORD.NAME) as string;

        signIn(
            { email, password },
            {
                onSuccess: () => router.push(ROUTES.DASHBOARD),
                onError: (err: any) => setApiError(err.message || "Failed to sign in"),
            }
        );
    }

    return (
        <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {PAGES.SIGNIN.TITLE || "Sign In"}
            </h1>

            <Form onSubmit={handleSubmit} className="flex flex-col gap-4" validationBehavior="native">
                <Input
                    isRequired
                    type={PAGES.SIGNIN.INPUTS.EMAIL.TYPE}
                    name={PAGES.SIGNIN.INPUTS.EMAIL.NAME}
                    label={PAGES.SIGNIN.INPUTS.EMAIL.LABEL}
                    placeholder={PAGES.SIGNIN.INPUTS.EMAIL.PLACEHOLDER}
                    errorMessage={PAGES.SIGNIN.ERRORS.INVALID_EMAIL}
                />

                <Input
                    isRequired
                    type={isPasswordVisible ? "text" : "password"}
                    name={PAGES.SIGNIN.INPUTS.PASSWORD.NAME}
                    label={PAGES.SIGNIN.INPUTS.PASSWORD.LABEL}
                    placeholder={PAGES.SIGNIN.INPUTS.PASSWORD.PLACEHOLDER}
                    endContent={
                        <button
                            aria-label="toggle password visibility"
                            type="button"
                            className="focus:outline-none"
                            onClick={toggleVisibility}
                        >
                            {isPasswordVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                />

                {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

                <Button type="submit" color="primary" disabled={isPending} className="w-full">
                    {isPending ? "Signing in..." : PAGES.SIGNIN.BUTTONS.SIGNIN.LABEL}
                </Button>
            </Form>
        </div>
    );
}
