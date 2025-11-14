'use client';

import { Icons } from '@components';
import { Input } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

type PasswordInputProps = {
  formId?: string;
  name?: string;
  autoComplete?: 'new-password' | 'current-password';
};

export function PasswordInput(props: PasswordInputProps) {
  const t = useTranslations('login');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const locale = useLocale();

  const className = locale === 'ar' ? 'placeholder-rtl' : '';

  return (
    <Input
      isRequired
      autoComplete={props.autoComplete}
      className={className}
      dir="ltr"
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <Icons.EyeSlashFilledIcon className="text-2xl pointer-events-none" />
          ) : (
            <Icons.EyeFilledIcon className="text-2xl pointer-events-none" />
          )}
        </button>
      }
      form={props.formId}
      label={t('password_input.label')}
      name={props.name || 'password'}
      placeholder={t('password_input.placeholder')}
      type={isVisible ? 'text' : 'password'}
    />
  );
}
