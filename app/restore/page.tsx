"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Image as ImageIcon, RotateCcw, AlertCircle } from "lucide-react"
import { useUserAuth } from '@/hooks/use-user-auth'
import LoginModal from "@/components/LoginModal"
import { supabase } from '@/lib/supabase'
import { useGuestUsage } from '@/hooks/use-guest-usage'
import { useAuthUserUsage } from '@/hooks/use-auth-user-usage'

export default function RestorePage() {
  const { user, loading: authLoading, isAuthenticated } = useUserAuth()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const guestUsage = useGuestUsage()
  const authUsage = useAuthUserUsage(user as any)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setRestoredUrl(null)
    }
  }

  const handleRestore = async () => {
    if (!selectedImage) return
    
    // 检查用户是否已登录
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setIsProcessing(true)
    
    try {
      // 创建FormData
      const formData = new FormData()
      formData.append('image', selectedImage)
      
      // 获取当前session的access token
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      
      if (!accessToken) {
        throw new Error('No access token available')
      }
      
      console.log('[Restore] Calling API with token:', accessToken.substring(0, 20) + '...')
      
      // 调用真实的修复API，包含认证头
      const response = await fetch('/api/restore', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('[Restore] Success:', result)
        // 成功后扣减次数
        if (isAuthenticated) {
          await authUsage.decrementUsageCount?.(1)
        } else {
          guestUsage.decrementGuestCount?.()
        }
        // 使用API返回的真实修复后图片URL
        if (result.restoredImageUrl) {
          setRestoredUrl(result.restoredImageUrl)
        } else {
          // 如果没有返回修复后的图片URL，使用原图（临时方案）
          setRestoredUrl(previewUrl)
        }
      } else {
        console.error('[Restore] API Error:', result.error)
        alert(`修复失败: ${result.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('[Restore] Network Error:', error)
      alert('网络错误，请稍后重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setRestoredUrl(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Photo Restoration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your old, blurry, or damaged photos and let our AI restore them to their former glory.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Photo
            </CardTitle>
            <CardDescription>
              Supported formats: JPG, PNG, WEBP. Maximum file size: 10MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 认证状态提示 */}
            {!authLoading && !isAuthenticated && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">需要登录</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  请先登录您的账户以使用照片修复功能
                </p>
                <Button 
                  onClick={() => setShowLoginModal(true)}
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  立即登录
                </Button>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!previewUrl ? (
                <div>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your photo here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button asChild>
                      <span>Choose Photo</span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div>
                                     {/* 当有修复结果时，并排显示原图和修复图 */}
                   {restoredUrl ? (
                     <div className="grid md:grid-cols-2 gap-6 mb-4">
                       <div>
                         <h3 className="text-sm font-medium text-gray-600 mb-2">Original Photo</h3>
                         <img
                           src={previewUrl}
                           alt="Original"
                           className="w-full rounded-lg shadow-lg"
                         />
                       </div>
                       <div>
                         <h3 className="text-sm font-medium text-gray-600 mb-2">Restored Photo</h3>
                         <img
                           src={restoredUrl}
                           alt="Restored"
                           className="w-full rounded-lg shadow-lg"
                         />

                       </div>
                     </div>
                   ) : (
                     /* 只有原图时，居中显示 */
                     <img
                       src={previewUrl}
                       alt="Preview"
                       className="max-w-md mx-auto rounded-lg shadow-lg mb-4"
                     />
                   )}
                   
                   <div className="flex gap-2 justify-center">
                     <Button 
                       onClick={handleRestore} 
                       disabled={isProcessing || (!authLoading && !isAuthenticated)}
                     >
                       {isProcessing ? (
                         <>
                           <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                           Processing...
                         </>
                       ) : (
                         <>
                           <ImageIcon className="w-4 h-4 mr-2" />
                           Restore Photo
                         </>
                       )}
                     </Button>
                     <Button variant="outline" onClick={handleReset}>
                       Reset
                     </Button>
                     {/* 下载按钮与其他按钮并排显示 */}
                     {restoredUrl && (
                       <Button className="bg-green-600 hover:bg-green-700">
                         <Download className="w-4 h-4" />
                       </Button>
                     )}
                   </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>



        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>High Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI uses state-of-the-art algorithms to restore photos with incredible detail and clarity.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fast Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get your restored photos in minutes, not hours. Perfect for quick projects and urgent needs.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>100% Free</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No hidden costs or subscriptions. Restore as many photos as you want, completely free.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
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
