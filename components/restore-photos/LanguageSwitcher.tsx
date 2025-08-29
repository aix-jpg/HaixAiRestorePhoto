import { useRouter } from 'next/router';
import { useState } from 'react';

const languageMap: Record<string, string> = {
  en: 'English',
  zh: '中文',
  vi: 'Tiếng Việt',
  ja: '日本語',
  ko: '한국어',
  kk: 'Қазақша',
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, asPath } = router;
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer min-w-24 text-sm font-medium text-gray-700 transition-colors"
      >
        {languageMap[locale ?? 'en'] || locale}
        <span className="ml-2 text-xs">▼</span>
      </button>
      {open && (
        <ul className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-24 py-1">
          {locales?.map((lng) => (
            <li key={lng}>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push(asPath, asPath, { locale: lng });
                }}
                disabled={lng === locale}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  lng === locale 
                    ? 'bg-blue-50 text-blue-600 font-medium cursor-not-allowed' 
                    : 'hover:bg-gray-50 text-gray-700 cursor-pointer'
                }`}
              >
                {languageMap[lng] || lng}
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* 点击外部关闭下拉菜单 */}
      {open && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
} 