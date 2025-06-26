import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '../i18n/en/translation.json'
import translationVI from '../i18n/vi/translation.json'

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
};

i18next.use(initReactI18next).init({
  lng: 'vi',
  debug: true,
  resources
})

