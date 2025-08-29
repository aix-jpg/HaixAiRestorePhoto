import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { access_token } = await request.json()
    
    if (!access_token) {
      return NextResponse.json({ success: false, error: 'No access token provided' }, { status: 400 })
    }

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

    // 使用access_token获取用户信息
    const { data: { user }, error } = await supabase.auth.getUser(access_token)
    
    if (error || !user) {
      console.error('[Verify Token] Error getting user:', error)
      return NextResponse.json({ success: false, error: error?.message || 'Invalid token' }, { status: 401 })
    }

    console.log('[Verify Token] User verified:', user.id)
    console.log('[Verify Token] User metadata:', user.user_metadata)
    
    // 创建新的session并设置cookie
    try {
      // 使用refreshSession来创建新的session
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()
      
      if (sessionError) {
        console.error('[Verify Token] Error refreshing session:', sessionError)
        // 如果refresh失败，尝试直接设置access_token到cookie
        const response = NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
            app_metadata: user.app_metadata
          }
        })
        
        // 手动设置认证相关的cookie
        response.cookies.set('sb-access-token', access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 3600 // 1小时
        })
        
        return response
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata
        }
      })
      
    } catch (sessionError) {
      console.error('[Verify Token] Session creation error:', sessionError)
      // 即使session创建失败，也返回用户信息
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata
        }
      })
    }

  } catch (error) {
    console.error('[Verify Token] Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
