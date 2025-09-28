// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files with the correct folder names
import en from './translation/English/translation.json';
import hi from './translation/Hindi/translation.json';

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;