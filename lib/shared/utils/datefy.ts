import type { Locale } from 'next-intl';

export function datefy(
  datestring: string | Date | null | undefined,
  locale: Locale = 'en',
  emptyResponse: string = 'N/A'
) {
  if (datestring === undefined || datestring === null) {
    return emptyResponse;
  }
  try {
    return new Date(datestring).toLocaleDateString(locale);
  } catch (error) {
    console.error(error);
    return 'Date could not be parsed';
  }
}
