"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useUserAuth } from "@/hooks/use-user-auth"
import LoginModal from "@/components/LoginModal"

interface Plan {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
  productId?: string
}

export default function PricingPage() {
  const { user, isAuthenticated } = useUserAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const plans: Plan[] = [
    {
      name: "Free",
      price: "$0",
      period: "",
      description: "Perfect for trying out our service",
      features: [
        "5 photos per month",
        "Basic restoration",
        "Standard quality",
        "Email support"
      ],
      buttonText: "Get Started Free",
      popular: false,
      productId: "free_starter_monthly",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For regular users who need more",
      features: [
        "50 photos per month",
        "Advanced restoration",
        "High quality output",
        "Priority support",
        "Batch processing"
      ],
      buttonText: "Start Pro Plan",
      popular: true,
      productId: "prod_51OxGxDi3NHPZ6HK33XUTi",
    },
    {
      name: "Enterprise",
      price: "$29.9",
      period: "",
      description: "For businesses and power users - One-time payment",
      features: [
        "Unlimited photos",
        "Premium restoration",
        "Highest quality",
        "24/7 support",
        "API access",
        "Custom integrations"
      ],
      buttonText: "Buy Now",
      popular: false,
      productId: "prod_20S2vnsK1gbbRn1s7Vqize",
    }
  ]

  const handleCheckout = async (plan: Plan) => {
    if (!plan.productId) return

    // 免费计划直接返回
    if (plan.price === "$0") {
      window.location.href = "/"
      return
    }

    if (!user || !isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      setLoadingPlan(plan.name)
      const response = await fetch("/api/creem-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: plan.productId,
          planName: plan.name,
          // 可选：金额仅用于记录，真实价格以后端/Creem 为准
          amount: Number(plan.price.replace(/[^0-9.]/g, "")) || undefined,
          userId: user.id,
          email: user.email,
        }),
      })

      const data = await response.json()
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert(data.error || "创建支付失败，请稍后再试")
      }
    } catch (err) {
      console.error(err)
      alert("创建支付失败，请检查网络或后台日志")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core AI restoration technology.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 justify-center">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative flex-1 max-w-sm ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  )}
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full">
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-auto ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name ? 'Processing...' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What photo formats do you support?
              </h3>
              <p className="text-gray-600">
                We support JPG, PNG, WEBP, and most common image formats. The maximum file size is 10MB.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does restoration take?
              </h3>
              <p className="text-gray-600">
                Most photos are restored within 2-5 minutes. Complex restorations may take up to 10 minutes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. No long-term contracts or hidden fees.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I'm not satisfied with the results?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not happy with the restoration, we'll refund your payment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to restore your photos?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of users who have already restored their precious memories with our AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleCheckout(plans[1])}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  View Examples
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginModal 
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        redirectTo="/pricing"
        title="登录账户"
        description="请登录后继续订阅"
      />
    </div>
  )
}
