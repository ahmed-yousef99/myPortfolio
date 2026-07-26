import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import en from '@/i18n/en.json'
import ar from '@/i18n/ar.json'
import { t as resolvePath, tArr as resolveArr, type Language } from '@/lib/utils'

const translations: Record<Language, Record<string, unknown>> = { en, ar }

function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lang') as Language | null
    if (stored === 'en' || stored === 'ar') return stored
    const browser = navigator.language?.startsWith('ar') ? 'ar' : 'en'
    return browser
  }
  return 'en'
}

interface LanguageContextValue {
  lang: Language
  setLang: (next: Language) => void
  toggleLang: () => void
  t: (path: string) => string
  tArr: (path: string) => string[]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: ReactNode
}

function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage)

  const setLang = useCallback((next: Language) => {
    setLangState(next)
    localStorage.setItem('lang', next)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ar' : 'en')
  }, [lang, setLang])

  const t = useCallback(
    (path: string): string => resolvePath(path, translations[lang]),
    [lang],
  )

  const tArr = useCallback(
    (path: string): string[] => resolveArr(path, translations[lang]),
    [lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tArr }}>
      {children}
    </LanguageContext.Provider>
  )
}

function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

export { LanguageProvider, useLanguage }
