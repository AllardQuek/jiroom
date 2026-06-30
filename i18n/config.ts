import { routing } from './routing';

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'zh-CN': '简',
};
