import type { Locale } from '@/i18n';
import type messages from '@/i18n/messages/en';
import type main from '@/i18n/messages/main.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages & typeof main;
  }
}
