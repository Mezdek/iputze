import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import type { Locale } from './index';
import { FALLBACK_LOCALE, locales } from './index';
import main from './messages/main.json';

export default getRequestConfig(async () => {
  const store = await cookies();
  const raw = store.get('locale')?.value;

  const locale: Locale = locales.includes(raw as Locale)
    ? (raw as Locale)
    : FALLBACK_LOCALE;
  const messages = (await import(`./messages/${locale}/index`)).default;

  // const main = (await import(`./messages/main/index`)).default;

  return {
    locale,
    messages: { ...main, ...messages },
  };
});
