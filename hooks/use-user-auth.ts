import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function useUserAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 获取初始用户状态
  const getInitialUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('[User Auth Hook] Initial user check:', user ? `user: ${user.id}` : 'no user', error?.message)
      
      if (user && !error) {
        console.log('[User Auth Hook] User metadata:', user.user_metadata)
        console.log('[User Auth Hook] App metadata:', user.app_metadata)
        setUser(user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('[User Auth Hook] Error getting initial user:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // 刷新用户信息的函数
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user && !error) {
        console.log('[User Auth Hook] User refreshed:', user.id)
        setUser(user)
        setIsAuthenticated(true)
        return user
      } else {
        setUser(null)
        setIsAuthenticated(false)
        return null
      }
    } catch (error) {
      console.error('[User Auth Hook] Refresh user failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getInitialUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[User Auth Hook] Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          console.log('[User Auth Hook] Session user metadata:', session.user.user_metadata)
          console.log('[User Auth Hook] App metadata:', session.user.app_metadata)
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [getInitialUser])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('[User Auth Hook] Sign out error:', error)
      } else {
        console.log('[User Auth Hook] User signed out successfully')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('[User Auth Hook] Sign out failed:', error)
    }
  }

  // 检查用户是否真的已登录的函数
  const verifyAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/user')
      const isValid = response.ok
      console.log('[User Auth Hook] Auth verification:', isValid ? 'valid' : 'invalid')
      return isValid
    } catch {
      console.log('[User Auth Hook] Auth verification failed')
      return false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    signOut,
    verifyAuth,
    refreshUser
  }
}