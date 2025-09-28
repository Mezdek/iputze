import type { Locale } from '@/i18n';
import messages from '@/i18n/messages/en';

declare module 'next-intl' {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
    }
}