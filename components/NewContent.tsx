"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function NewContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // 这里可以添加您的业务逻辑
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 欢迎区域 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            欢迎来到新项目
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            这是一个示例页面，展示了如何替换原有的聊天功能。您可以在这里添加您其他项目的前端内容。
          </p>
        </div>

        {/* 功能卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>功能一</CardTitle>
              <CardDescription>这是第一个功能模块的描述</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                您可以在这里添加您其他项目的具体功能内容。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能二</CardTitle>
              <CardDescription>这是第二个功能模块的描述</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                继续添加更多功能模块，构建完整的应用界面。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能三</CardTitle>
              <CardDescription>这是第三个功能模块的描述</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                根据您的需求，可以添加表单、图表、列表等各种组件。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 联系表单 */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>联系我们</CardTitle>
            <CardDescription>填写下面的表单与我们取得联系</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="请输入您的邮箱"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">留言</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="请输入您的留言"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                提交
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 说明文字 */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            这个组件展示了如何替换原有的聊天功能。您可以将整个组件内容替换为您其他项目的代码。
          </p>
          <p className="mt-2">
            要使用这个新内容，请在 <code className="bg-gray-100 px-2 py-1 rounded">app/page.tsx</code> 中将 <code className="bg-gray-100 px-2 py-1 rounded">&lt;MainContent /&gt;</code> 替换为 <code className="bg-gray-100 px-2 py-1 rounded">&lt;NewContent /&gt;</code>
          </p>
        </div>
      </div>
    </div>
  )
}
