'use client';
import { Locale, locales } from '@/i18n';
import { addToast } from '@heroui/react';
import { useSetLocale } from '@hooks';
import { useLocale, useTranslations } from 'next-intl';

function isValidLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}

export function LocaleSwitcher(props: { locales?: Locale[] }) {
    const { mutateAsync: setLocale } = useSetLocale();
    const t = useTranslations("navbar.locales");
    const locale = useLocale();

    const handleLocaleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        if (!isValidLocale(value)) {
            console.error('Invalid locale selected:', value);
            addToast({
                title: 'Error',
                description: 'Invalid language selected',
                color: 'danger'
            });
            return;
        }

        try {
            await setLocale({ locale: value });
        } catch (error) {
            console.error('Failed to set locale:', error);
            addToast({
                title: 'Error',
                description: 'Failed to change language',
                color: 'danger'
            });
        }
    };

    const availableLocales = [...locales, ...(props?.locales ?? [])];

    return (
        <select 
            defaultValue={locale} 
            onChange={handleLocaleChange}
            className="border rounded px-2 py-1"
        >
            {availableLocales.map((l) => (
                <option key={l} value={l}>
                    {t(l)}
                </option>
            ))}
        </select>
    );
}