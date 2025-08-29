"use client"

import { useI18n, type SupportedLocale } from "@/lib/i18n"

const languages: { code: SupportedLocale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "kk", label: "Қазақ" },
  { code: "vi", label: "Tiếng Việt" }
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  return (
    <select
      className="text-sm border rounded px-2 py-1 bg-white"
      value={locale}
      onChange={(e) => setLocale(e.target.value as SupportedLocale)}
      aria-label="Language"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  )
}


