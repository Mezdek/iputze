'use client';

import { FormError, PasswordInput } from '@components';
import {
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Link,
  Tab,
  Tabs,
} from '@heroui/react';
import { useErrorToast, useSignIn, useSignUp } from '@hooks';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { parseFormData } from '@/lib/client/utils/parseFormData';
import { getPath } from '@/lib/shared/constants/pathes';
import {
  ApiError,
  type SignInRequestBody,
  type UserCreationBody,
} from '@/types';

export function LoginWidget() {
  const t = useTranslations('login');
  const router = useRouter();
  const [selected, setSelected] = useState('sign_in');

  const SIGNIN_FORM = 'signin_form';
  const SIGNUP_FORM = 'signup_form';

  const { mutate: signIn, isPending } = useSignIn();
  const { mutateAsync: signUp } = useSignUp();
  const { showErrorToast } = useErrorToast();

  const [apiError, setApiError] = useState<string>();

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    const data = parseFormData<SignInRequestBody>(e.currentTarget, {
      email: '',
      password: '',
    });
    signIn(data, {
      onSuccess: () => router.push(getPath().DASHBOARD),
      onError: (error: Error) =>
        setApiError(error.message || 'Failed to sign in'),
    });
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    const data = parseFormData<UserCreationBody>(e.currentTarget, {
      email: '',
      name: '',
      password: '',
    });
    try {
      await signUp(data);
      setSelected('sign_in');
    } catch (e: unknown) {
      const message = handleLoginErrors(e);
      showErrorToast(e);
      setApiError(message);
    }
  };

  return (
    <Card className="max-w-full lg:w-1/4 h-1/2">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          aria-label="Tabs form"
          selectedKey={selected}
          size="lg"
          onSelectionChange={(key) => setSelected(key as string)}
        >
          <Tab
            className="h-full bg"
            key="sign_in"
            title={t('signin_tab_title')}
          >
            <Form
              className="flex flex-col gap-4 h-full justify-between"
              id={SIGNIN_FORM}
              onSubmit={handleSignIn}
            >
              <div className="flex flex-col gap-4 h-full w-full">
                <Input
                  isRequired
                  form={SIGNIN_FORM}
                  label={t('email_input.label')}
                  name="email"
                  placeholder={t('email_input.placeholder')}
                  type="email"
                />
                <PasswordInput
                  autoComplete="current-password"
                  formId={SIGNIN_FORM}
                />
                <FormError message={apiError} />
                <p className="text-small">
                  {t.rich('signup_invite', {
                    Link: (chunks) => (
                      <Link
                        className="cursor-pointer"
                        size="sm"
                        onPress={() => setSelected('sign_up')}
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
              <Button
                fullWidth
                color="primary"
                form={SIGNIN_FORM}
                isLoading={isPending}
                size="lg"
                type="submit"
              >
                {t('signin_button')}
              </Button>
            </Form>
          </Tab>
          <Tab className="h-full" key="sign_up" title={t('signup_tab_title')}>
            <Form
              className="flex flex-col gap-4 h-full justify-between"
              id={SIGNUP_FORM}
              onSubmit={handleSignUp}
            >
              <div className="flex flex-col gap-4 h-full w-full">
                <Input
                  isRequired
                  form={SIGNUP_FORM}
                  label={t('name_input.label')}
                  name="name"
                  placeholder={t('name_input.placeholder')}
                />
                <Input
                  isRequired
                  form={SIGNUP_FORM}
                  label={t('email_input.label')}
                  name="email"
                  placeholder={t('email_input.placeholder')}
                  type="email"
                />
                <PasswordInput
                  autoComplete="new-password"
                  formId={SIGNUP_FORM}
                />
                <FormError message={apiError} />
                <p className="text-small">
                  {t.rich('signin_invite', {
                    Link: (chunks) => (
                      <Link
                        className="cursor-pointer"
                        size="sm"
                        onPress={() => setSelected('sign_in')}
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
              <Button
                fullWidth
                color="primary"
                form={SIGNUP_FORM}
                size="lg"
                type="submit"
              >
                {t('signup_button')}
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

export function handleLoginErrors(error: unknown): string {
  if (error instanceof ApiError && error.isConflict())
    return 'E-Mail already exists';
  return 'Failed to sign up';
}
