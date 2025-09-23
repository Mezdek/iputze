'use client'

import type { SignInRequestBody, SignUpRequestBody } from "@/types";
import { FormError, PasswordInput } from "@components";
import { Button, Card, CardBody, Form, Input, Link, Tab, Tabs } from "@heroui/react";
import { useSignIn, useSignUp } from "@hooks";
import { getPath, parseFormData } from "@lib";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginWidget() {
  const router = useRouter();
  const [selected, setSelected] = useState("sign_in");

  const SIGNIN_FORM = "signin_form";
  const SIGNUP_FORM = "signup_form";

  const { mutate: signIn, isPending } = useSignIn();
  const { mutateAsync: signUp } = useSignUp();

  const [apiError, setApiError] = useState<string>();

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    const data = parseFormData<SignInRequestBody>(e.currentTarget, { email: "", password: "" });
    signIn(data, {
      onSuccess: () => router.push(getPath().DASHBOARD),
      onError: (err: any) => setApiError(err.message || "Failed to sign in"),
    });
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    const data = parseFormData<SignUpRequestBody>(e.currentTarget, { email: "", name: "", password: "" });
    try {
      await signUp(data);
      setSelected("sign_in");
    } catch (e: any) {
      const message = handleLoginErrors(e)
      console.error(e);
      setApiError(message);
    }
  };

  return (
    <Card className="max-w-full w-1/4 h-1/2">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          aria-label="Tabs form"
          selectedKey={selected}
          size="lg"
          onSelectionChange={(key) => setSelected(key as string)}
        >
          <Tab key="sign_in" title="Login" className="h-full bg">
            <Form className="flex flex-col gap-4 h-full justify-between" onSubmit={handleSignIn} id={SIGNIN_FORM}>
              <div className="flex flex-col gap-4 h-full w-full">
                <Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" form={SIGNIN_FORM} />
                <PasswordInput formId={SIGNIN_FORM} autoComplete="current-password" />
                <FormError message={apiError} />
                <p className="text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign_up")}>
                    Sign up
                  </Link>
                </p>
              </div>
              <Button fullWidth color="primary" type="submit" isLoading={isPending} form={SIGNIN_FORM} size="lg">
                Sign In
              </Button>
            </Form>
          </Tab>
          <Tab key="sign_up" title="Sign up" className="h-full">
            <Form className="flex flex-col gap-4 h-full justify-between" onSubmit={handleSignUp} id={SIGNUP_FORM}>
              <div className="flex flex-col gap-4 h-full w-full">
                <Input isRequired label="Name" placeholder="Enter your name" name="name" form={SIGNUP_FORM} />
                <Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" form={SIGNUP_FORM} />
                <PasswordInput formId={SIGNUP_FORM} autoComplete="new-password" />
                <FormError message={apiError} />
                <p className="text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign_in")}>
                    Sign in
                  </Link>
                </p>
              </div>
              <Button fullWidth color="primary" type="submit" form={SIGNUP_FORM} size="lg">
                Sign up
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}


export function handleLoginErrors(e: unknown): string {
  if (isAxiosError(e)) {
    if (e.status === 409) {
      return "E-Mail already exists"
    }
  }
  return "Failed to sign up"
}
