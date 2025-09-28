'use client';
import { Locale, locales } from '@/i18n';
import { useSetLocale } from '@hooks';
import { useLocale, useTranslations } from 'next-intl';

export function LocaleSwitcher(props: { locales?: Locale[] }) {
    const { mutateAsync: setLocale } = useSetLocale();
    const t = useTranslations("navbar.locales")
    const locale = useLocale()

    return (
        <select defaultValue={locale} onChange={(e) => setLocale({ locale: e.target.value as Locale })}>
            {[...locales, ...(props?.locales ?? [])].map((l) => <option key={l} value={l}>{
                t(l)
            }</option>)}
        </select>
    );
}
