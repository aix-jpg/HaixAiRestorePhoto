"use client"

import type React from "react"
import Link from "next/link"

export default function RestorePhotosHome() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Photo Restore AI</h1>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/restore" className="text-gray-600 hover:text-gray-900 transition-colors">Restore</Link>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="inline-flex items-center rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20 text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-blue-200">Used by over 470,000 happy users</span>
            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Restore your old photos
              <span className="block">with AI</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Have old and blurry face photos? Let our AI restore them so those memories can live on. 100% free – restore your photos today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://www.haixiang.online/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
              >
                Check out haixiang.online
              </a>
              <Link
                href="/restore"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
              >
                Restore Photo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 对比展示 */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Photo</h3>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                  <img
                    alt="Original photo"
                    src="/old.jpg"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Restored Photo</h3>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                  <img
                    alt="Restored photo"
                    src="/old-new.jpg"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特性 */}
      <section className="py-12 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">Why Choose Our AI Photo Restoration?</h3>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Fast Processing</h4>
              <p className="mt-1 text-gray-600">Get your restored photos in minutes, not hours</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">High Quality</h4>
              <p className="mt-1 text-gray-600">Advanced AI algorithms for stunning results</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">100% Free</h4>
              <p className="mt-1 text-gray-600">No hidden costs, completely free to use</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-gray-400 text-sm">© 2024 Photo Restore AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

