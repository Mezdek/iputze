import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { FALLBACK_LOCALE, Locale, locales } from '.';
import messagess from "./messages/en/index"

export default getRequestConfig(async () => {
  const store = await cookies();
  const raw = store.get('locale')?.value;

  const locale: Locale = (locales).includes(raw as Locale)
    ? (raw as Locale)
    : FALLBACK_LOCALE;
  const messages = (await import(`./messages/${locale}/index`)).default;
  return {
    locale,
    messages: { ...messages }
  };
});