"use client"

import Link from "next/link"
import Header from "./Header"
import { useState } from "react"
import LoginModal from "@/components/LoginModal"
import { useI18n } from "@/lib/i18n"

export default function HomeClassic() {
  const { t } = useI18n()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleSignIn = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 使用正确的Header组件 */}
      <Header onSignIn={handleSignIn} />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-8 text-center">
        <span className="inline-block text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
          Used by over <b>470,000</b> happy users
        </span>
        <h1 className="mt-5 text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
          {t("hero.title.line1")}
          <span className="block">{t("hero.title.line2")}</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="https://www.haixiang.online/"
            target="_blank"
            rel="noreferrer"
            className="bg-white border rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            Check out haixiang.online
          </a>
          <Link
            href="/restore"
            className="bg-black text-white rounded-xl px-4 py-2.5 text-sm hover:black/80"
          >
            {t("hero.cta.restore")}
          </Link>
        </div>
      </section>

      {/* 并排对比图（旧版紧凑风格） */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
          <div className="text-center">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Original Photo</h3>
            <div className="w-[420px] max-w-full rounded-2xl overflow-hidden border shadow-sm bg-white">
              <img src="/old.jpg" alt="original" className="w-full h-[520px] object-contain bg-gray-100" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Restored Photo</h3>
            <div className="w-[420px] max-w-full rounded-2xl overflow-hidden border shadow-sm bg-white">
              <img src="/old-new.jpg" alt="restored" className="w-full h-[520px] object-contain bg-gray-100" />
            </div>
          </div>
        </div>
      </section>

      {/* 保留：底部说明区（不要删除） */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-slate-900">Why Choose Our AI Photo Restoration?</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h4 className="text-base font-semibold">Fast Processing</h4>
            <p className="mt-1 text-sm text-gray-600">Get your restored photos in minutes, not hours.</p>
          </div>
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="text-base font-semibold">High Quality</h4>
            <p className="mt-1 text-sm text-gray-600">Advanced AI algorithms for stunning results.</p>
          </div>
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
            </div>
            <h4 className="text-base font-semibold">100% Free</h4>
            <p className="mt-1 text-sm text-gray-600">No hidden costs, completely free to use.</p>
          </div>
        </div>
      </section>

      {/* 页脚文案（不要删除） */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-500">
          © 2024 Photo Restore AI. All rights reserved. Built with love to help your memories live on.
        </div>
      </footer>

      {/* 登录弹窗 */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        redirectTo="/restore"
        title="登录账户"
        description="请登录后使用照片修复功能"
      />
    </div>
  )
}
