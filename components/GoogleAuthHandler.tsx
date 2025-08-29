"use client"

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function GoogleAuthHandler() {
  useEffect(() => {
    // 检查URL hash中是否有access_token
    const checkForAccessToken = () => {
      if (typeof window === 'undefined') return
      
      if (window.location.hash && window.location.hash.includes('access_token=')) {
        console.log('[GoogleAuthHandler] Found access_token in URL hash, processing...')
        
        // 提取access_token
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        
        if (accessToken) {
          console.log('[GoogleAuthHandler] Access token found:', accessToken.substring(0, 20) + '...')
          
          // 清除URL hash
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
          
          // 使用Supabase客户端处理token
          handleGoogleToken(accessToken)
        }
      }
    }

    const handleGoogleToken = async (token: string) => {
      try {
        console.log('[GoogleAuthHandler] Processing Google token...')
        
        // 使用token获取用户信息
        const { data: { user }, error } = await supabase.auth.getUser(token)
        
        if (user && !error) {
          console.log('[GoogleAuthHandler] Google user authenticated:', user.id)
          console.log('[GoogleAuthHandler] User metadata:', user.user_metadata)
          
          // 尝试刷新认证状态
          await supabase.auth.refreshSession()
          
          // 触发页面刷新以更新UI
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          console.error('[GoogleAuthHandler] Google token validation failed:', error)
        }
      } catch (error) {
        console.error('[GoogleAuthHandler] Google token processing error:', error)
      }
    }

    // 立即检查
    checkForAccessToken()
    
    // 监听hash变化
    const handleHashChange = () => {
      checkForAccessToken()
    }
    
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // 这个组件不渲染任何内容
  return null
}
