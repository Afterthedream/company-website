'use client'

import { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import HttpApi from 'i18next-http-backend'

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [i18nInitialized, setI18nInitialized] = useState(false)

  useEffect(() => {
    const initializeI18n = async () => {
      await i18next
        .use(HttpApi)
        .use(initReactI18next)
        .init({
          lng: 'zh',
          fallbackLng: 'zh',
          supportedLngs: ['zh', 'en'],
          backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
          },
          ns: ['common'],
          defaultNS: 'common',
          react: {
            useSuspense: false
          }
        })
      setI18nInitialized(true)
    }

    initializeI18n()
  }, [])

  if (!i18nInitialized) {
    return null
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}