'use client'

import type { SignInRequestBody, SignUpRequestBody } from "@apptypes";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@components";
import { Button, Card, CardBody, Form, Input, Link, Tab, Tabs } from "@heroui/react";
import { useSignIn, useSignUp } from "@hooks";
import { getPath, parseFormData } from "@lib";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function Login() {
  const [isPasswordVisibleLogin, setIsPasswordVisibleLogin] = useState(false);
  const [isPasswordVisibleSignup, setIsPasswordVisibleSignup] = useState(false);
  const router = useRouter();
  const [selected, setSelected] = useState("login");

  const { mutate: signIn, isPending } = useSignIn();
  const { mutateAsync: signUp } = useSignUp();

  const [apiError, setApiError] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
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
      setSelected("login"); // Switch back to login after successful signup
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to sign up");
    }
  };

  return (
    <Card className="max-w-full w-[340px] h-[420px]">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          aria-label="Tabs form"
          selectedKey={selected}
          size="md"
          onSelectionChange={(key) => setSelected(key as string)}
        >
          <Tab key="login" title="Login">
            <Form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" />
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type={isPasswordVisibleLogin ? "text" : "password"}
                name="password"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setIsPasswordVisibleLogin(!isPasswordVisibleLogin)}
                  >
                    {isPasswordVisibleLogin ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
              <p className="text-center text-small">
                Need to create an account?{" "}
                <Link size="sm" onPress={() => setSelected("sign-up")}>
                  Sign up
                </Link>
              </p>
              <Button fullWidth color="primary" type="submit" isLoading={isPending}>
                Login
              </Button>
            </Form>
          </Tab>
          <Tab key="sign-up" title="Sign up">
            <Form className="flex flex-col gap-4 h-[300px]" onSubmit={handleSignUp}>
              <Input isRequired label="Name" placeholder="Enter your name" name="name" />
              <Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" />
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type={isPasswordVisibleSignup ? "text" : "password"}
                name="password"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setIsPasswordVisibleSignup(!isPasswordVisibleSignup)}
                  >
                    {isPasswordVisibleSignup ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
              <p className="text-center text-small">
                Already have an account?{" "}
                <Link size="sm" onPress={() => setSelected("login")}>
                  Login
                </Link>
              </p>
              <Button fullWidth color="primary" type="submit">
                Sign up
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
