"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useI18n } from "@/lib/i18n"
import { useUserAuth } from '@/hooks/use-user-auth'
import { useGuestUsage } from '@/hooks/use-guest-usage'
import { useAuthUserUsage } from '@/hooks/use-auth-user-usage'

interface HeaderProps {
  onSignIn: () => void
}

export default function Header({ onSignIn }: HeaderProps) {
  const { t } = useI18n()
  const { user, loading: authLoading, signOut: userSignOut, refreshUser } = useUserAuth()
  const guestUsage = useGuestUsage()
  const authUsage = useAuthUserUsage(user)

  const signOut = async () => {
    await userSignOut()
  }

  // 手动刷新用户信息（调试用）
  const handleRefreshUser = async () => {
    console.log('[Header] Manually refreshing user...')
    await refreshUser()
  }

  // 获取用户显示名称的辅助函数
  const getUserDisplayName = (user: any) => {
    if (!user) return ''
    
    console.log('[Header] User object:', user)
    console.log('[Header] User metadata:', user.user_metadata)
    console.log('[Header] App metadata:', user.app_metadata)
    
    // 优先显示Google账号的姓名
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    
    // 如果有Google账号的姓名
    if (user.user_metadata?.name) {
      return user.user_metadata.name
    }
    
    // 如果有Google账号的given_name和family_name
    if (user.user_metadata?.given_name && user.user_metadata?.family_name) {
      return `${user.user_metadata.given_name} ${user.user_metadata.family_name}`
    }
    
    // 最后回退到邮箱
    return user.email || '用户'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium text-gray-800">{t("app.title")}</h1>
          <a href="/pricing" className="text-sm text-gray-600 hover:text-[#FFC999] transition-colors">
            {t("nav.pricing")}
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Usage Count Display */}
          <LanguageSwitcher />
          {authLoading ? (
            <div className="w-16 h-6 rounded bg-gray-200 animate-pulse"></div>
          ) : user ? (
            !authUsage.loading && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{t("usage.left")}:</span>
                <span className="font-medium text-[#FFC999]">{authUsage.usageCount || 0}</span>
              </div>
            )
          ) : (
            !guestUsage.loading && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{t("guest.usage")}:</span>
                <span className="font-medium text-[#FFC999]">{guestUsage.guestCount}</span>
              </div>
            )
          )}

          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {getUserDisplayName(user)}
                </span>
                {/* 显示登录方式标识 */}
                {user.app_metadata?.provider && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {user.app_metadata.provider === 'google' ? 'Google' : user.app_metadata.provider}
                  </span>
                )}
              </div>
              
              {/* 调试按钮 - 手动刷新用户信息 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshUser}
                className="flex items-center gap-1 text-xs"
                title="刷新用户信息"
              >
                🔄
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                登出
              </Button>
            </div>
          ) : (
            <Button
              onClick={onSignIn}
              className="flex items-center gap-2 bg-[#FFC999] hover:bg-[#FFB366] text-white"
            >
              <LogIn className="w-4 h-4" />
              Google 登录
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
