import { addToast } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { ClientError } from '@/lib/shared/errors/client/ClientError';
import { ErrorCodes } from '@/lib/shared/errors/client/errorCodes';

export function useErrorToast() {
  const t = useTranslations();

  const showErrorToast = (err: unknown) => {
    if (err instanceof ClientError) {
      const msg = ErrorCodes[err.context];
      //@ts-expect-error i18n errors
      const title = t(`${err.context}.errors.${err.code}.title`);
      //@ts-expect-error i18n errors
      const description = t(`${err.context}.errors.${err.code}.description`);
      if (msg) {
        addToast({ title, description, color: 'danger' });
        return;
      }
    }
    addToast({
      title: 'Unexpected error',
      description: 'Please try again later',
      color: 'danger',
    });
  };

  return { showErrorToast };
}
