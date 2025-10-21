'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
export const Logo = () => {
  const t = useTranslations();
  return (
    <div className="flex">
      <Image alt={t('app_name')} height="35" src="/logo.png" width="35" />
      <p className="flex justify-center items-end font-bold text-lg">
        {t('app_name')}
      </p>
    </div>
  );
};
