export const locales = ['en', 'zh-CN'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
};

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'zh-CN': '简',
};
