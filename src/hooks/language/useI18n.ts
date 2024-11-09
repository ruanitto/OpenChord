import i18next from 'i18next';

import { SupportedLanguages } from './schema';

const changeLanguage = (lang: SupportedLanguages) => {
  i18next.changeLanguage(lang);
};

const toggleLanguage = () => {
  i18next.changeLanguage(
    i18next.language === SupportedLanguages.EN_EN
      ? SupportedLanguages.PT_BR
      : SupportedLanguages.EN_EN,
  );
};

export const useI18n = () => {
  return { changeLanguage, toggleLanguage, language: i18next.language as SupportedLanguages};
};
