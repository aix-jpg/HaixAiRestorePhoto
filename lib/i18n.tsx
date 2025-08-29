"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type SupportedLocale = "en" | "zh" | "kk" | "vi"

type Messages = Record<string, string>

type I18nContextValue = {
  locale: SupportedLocale
  setLocale: (l: SupportedLocale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const DEFAULT_LOCALE: SupportedLocale = "en"
const STORAGE_KEY = "app_locale"

async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  switch (locale) {
    case "zh":
      return (await import("@/locales/zh.json")).default
    case "kk":
      return (await import("@/locales/kk.json")).default
    case "vi":
      return (await import("@/locales/vi.json")).default
    case "en":
    default:
      return (await import("@/locales/en.json")).default
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE)
  const [messages, setMessages] = useState<Messages>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null
      if (saved) {
        setLocaleState(saved)
      }
    } catch {}
  }, [])

  useEffect(() => {
    let mounted = true
    loadMessages(locale).then((m) => {
      if (mounted) setMessages(m)
    })
    return () => {
      mounted = false
    }
  }, [locale])

  const setLocale = (l: SupportedLocale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {}
  }

  const t = useMemo(() => {
    return (key: string) => messages[key] ?? key
  }, [messages])

  const value: I18nContextValue = { locale, setLocale, t }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}


