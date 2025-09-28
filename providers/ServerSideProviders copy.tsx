import { NextIntlClientProvider } from 'next-intl';

export function ServerSideProviders({ children }: { children: React.ReactNode }) {

    return (
        <NextIntlClientProvider>
            {children}
        </NextIntlClientProvider>
    )
}
