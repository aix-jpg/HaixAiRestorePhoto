import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // 检查认证状态 - 支持多种认证方式
    let user = null
    let authError = null
    
    // 首先尝试从Authorization header获取token
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      console.log('[Restore API] Using Bearer token:', token.substring(0, 20) + '...')
      
      try {
        // 创建supabase客户端来验证token
        const supabaseClient = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) {
                return undefined // 不使用cookies
              },
              set(name: string, value: string, options: any) {
                // 不使用cookies
              },
              remove(name: string, options: any) {
                // 不使用cookies
              },
            },
          }
        )
        
        const { data: { user: tokenUser }, error } = await supabaseClient.auth.getUser(token)
        if (tokenUser && !error) {
          user = tokenUser
          console.log('[Restore API] User authenticated via Bearer token:', user.id)
        } else {
          authError = error
          console.log('[Restore API] Bearer token validation failed:', error?.message)
        }
      } catch (tokenError) {
        console.log('[Restore API] Bearer token processing error:', tokenError)
      }
    }
    
    // 如果Bearer token失败，尝试从cookies获取
    if (!user) {
      console.log('[Restore API] Falling back to cookie-based auth')
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

      const { data: { user: cookieUser }, error } = await supabase.auth.getUser()
      if (cookieUser && !error) {
        user = cookieUser
        console.log('[Restore API] User authenticated via cookies:', user.id)
      } else {
        authError = error
        console.log('[Restore API] Cookie auth failed:', error?.message)
      }
    }
    
    if (authError || !user) {
      console.error('[Restore API] Authentication failed:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Restore API] User authenticated successfully:', user.id, user.email)

    // 获取表单数据
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // 检查文件大小
    if (imageFile.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 })
    }

    // 检查文件类型
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed' }, { status: 400 })
    }

    // 使用Replicate API进行照片修复
    console.log('[Restore API] Processing image for user:', user.id)
    console.log('[Restore API] Image file:', imageFile.name, imageFile.size, imageFile.type)

    // 检查是否有Replicate API密钥
    const replicateApiToken = process.env.REPLICATE_API_TOKEN
    console.log('[Restore API] Environment check - REPLICATE_API_TOKEN:', replicateApiToken ? 'Found' : 'Not found')
    console.log('[Restore API] All environment variables:', Object.keys(process.env).filter(key => key.includes('REPLICATE')))
    
    if (!replicateApiToken) {
      console.error('[Restore API] REPLICATE_API_TOKEN not configured')
      console.error('[Restore API] Available env vars:', Object.keys(process.env).slice(0, 10)) // 显示前10个环境变量
      return NextResponse.json({ 
        error: 'AI service not configured. Please contact support.' 
      }, { status: 500 })
    }

    try {
      // 将图片转换为base64
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      const base64Image = imageBuffer.toString('base64')
      const dataUrl = `data:${imageFile.type};base64,${base64Image}`
      
      console.log('[Restore API] Starting AI restoration with Replicate...')
      
      // 调用Replicate API进行照片修复
      // 使用GFPGAN模型进行面部修复
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3", // GFPGAN模型
          input: {
            img: dataUrl,
            version: "v1.4",
            scale: 2
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[Restore API] Replicate API error:', errorData)
        throw new Error(`AI service error: ${errorData.detail || 'Unknown error'}`)
      }

      const prediction = await response.json()
      console.log('[Restore API] Prediction started:', prediction.id)
      
      // 等待处理完成
      let result = null
      let attempts = 0
      const maxAttempts = 60 // 最多等待5分钟
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // 等待5秒
        
        const statusResponse = await fetch(prediction.urls.get, {
          headers: {
            'Authorization': `Token ${replicateApiToken}`,
          }
        })
        
        if (statusResponse.ok) {
          result = await statusResponse.json()
          console.log('[Restore API] Prediction status:', result.status)
          
          if (result.status === 'succeeded') {
            break
          } else if (result.status === 'failed') {
            throw new Error('AI processing failed')
          }
        }
        
        attempts++
      }
      
      if (!result || result.status !== 'succeeded') {
        throw new Error('AI processing timeout')
      }
      
      console.log('[Restore API] AI restoration completed successfully')
      
      // 返回修复后的图片URL
      return NextResponse.json({
        success: true,
        message: 'Photo restoration completed successfully',
        restoredImageUrl: result.output, // 这是修复后的图片URL
        processingTime: `${attempts * 5} seconds`,
        predictionId: prediction.id
      })
      
    } catch (aiError) {
      console.error('[Restore API] AI processing error:', aiError)
      const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown AI error'
      return NextResponse.json({ 
        error: `AI processing failed: ${errorMessage}` 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('[Restore API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
