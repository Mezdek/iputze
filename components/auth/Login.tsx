'use client'

import type { SignInRequestBody, SignUpRequestBody } from "@apptypes";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@components";
import { Button, Card, CardBody, Form, Input, Link, Tab, Tabs } from "@heroui/react";
import { useSignIn } from "@hooks";
import { getPath, parseFormData } from "@lib";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";


export function Login() {

  const [isPasswordVisible_login, setIsPasswordVisible_login] = useState(false);
  const [isPasswordVisible_signup, setIsPasswordVisible_signup] = useState(false);
  const toggleVisibility_login = () => setIsPasswordVisible_login(!isPasswordVisible_login);
  const toggleVisibility_signup = () => setIsPasswordVisible_signup(!isPasswordVisible_signup);
  const router = useRouter();
  const [selected, setSelected] = useState("login");

  const { mutate: signIn, isPending } = useSignIn();

  const LOGIN_FORM = "login_form";
  const SIGNUP_FORM = "signup_form";

  const [apiError, setApiError] = useState("");


  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = parseFormData<SignInRequestBody>(e.currentTarget, { email: "", password: "" });
    signIn(
      data,
      {
        onSuccess: () => router.push(getPath().DASHBOARD),
        onError: (err: any) => setApiError(err.message || "Failed to sign in"),
      }
    );
  }

  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = parseFormData<SignUpRequestBody>(e.currentTarget, { email: "", name: "", password: "" })
  }

  return (

    <Card className="max-w-full w-[340px] h-[400px]">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          aria-label="Tabs form"
          selectedKey={selected}
          size="md"
          onSelectionChange={(key) => setSelected(key as string)}
        >
          <Tab key="login" title="Login">
            <Form className="flex flex-col gap-4" id={LOGIN_FORM} onSubmit={handleLogin}>
              <Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" form={LOGIN_FORM} />
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type={isPasswordVisible_login ? "text" : "password"}
                form={LOGIN_FORM}
                name="password"

                endContent={
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    className="focus:outline-none"
                    onClick={toggleVisibility_login}
                  >
                    {isPasswordVisible_login ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              <p className="text-center text-small">
                Need to create an account?
                <Link size="sm" onPress={() => setSelected("sign-up")}>
                  Sign up
                </Link>
              </p>
              <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary" type="submit" form={LOGIN_FORM}>
                  Login
                </Button>
              </div>
            </Form>
          </Tab>
          <Tab key="sign-up" title="Sign up">
            <Form className="flex flex-col gap-4 h-[300px]" id={SIGNUP_FORM} onSubmit={handleSignUp}>
              <Input isRequired label="Name" placeholder="Enter your name" name="name" form={SIGNUP_FORM} />
              <Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" form={SIGNUP_FORM} />
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type={isPasswordVisible_signup ? "text" : "password"}
                form={SIGNUP_FORM}
                name="password"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    type="button"
                    className="focus:outline-none"
                    onClick={toggleVisibility_signup}
                  >
                    {isPasswordVisible_signup ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              <p className="text-center text-small">
                Already have an account?
                <Link size="sm" onPress={() => setSelected("login")}>
                  Login
                </Link>
              </p>
              <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary" type="submit" form={SIGNUP_FORM}>
                  Sign up
                </Button>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  )
}
