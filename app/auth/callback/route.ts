import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete(name)
          },
        },
      }
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[Auth Callback] Exchange code error:', error)
        // 发生错误时跳转到登录页面
        return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
      }

      if (data.user) {
        console.log('[Auth Callback] User authenticated:', data.user.id)
        console.log('[Auth Callback] User metadata:', data.user.user_metadata)
        console.log('[Auth Callback] App metadata:', data.user.app_metadata)
        
        // 成功登录后跳转到指定页面
        return NextResponse.redirect(new URL(redirect, requestUrl.origin))
      }
    } catch (error) {
      console.error('[Auth Callback] Unexpected error:', error)
      return NextResponse.redirect(new URL('/login?error=unexpected_error', requestUrl.origin))
    }
  }

  // 没有code参数时跳转到首页
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}