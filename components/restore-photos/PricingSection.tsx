import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  priceId: string; // Stripe Price ID
}

export default function PricingSection() {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: '基础版',
      price: '免费',
      period: '',
      features: [
        '每天 3 次修复',
        '基础 AI 修复',
        '标准画质输出',
        '社区支持'
      ],
      priceId: ''
    },
    {
      id: 'pro',
      name: '专业版',
      price: '¥29',
      period: '/月',
      features: [
        '无限次修复',
        '高级 AI 修复',
        '高清画质输出',
        '批量处理',
        '优先处理',
        '邮件支持'
      ],
      popular: true,
      priceId: 'sanhai_pro_monthly' // Creem 产品 ID
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: '¥99',
      period: '/月',
      features: [
        '无限次修复',
        '企业级 AI 修复',
        '4K 超高清输出',
        'API 访问',
        '批量处理',
        '专属客服',
        '自定义品牌'
      ],
      priceId: 'sanhai_enterprise_monthly' // Creem 产品 ID
    }
  ];

  const handleSubscribe = async (priceId: string, planId: string) => {
    if (!priceId) return; // 免费计划
    
    setLoading(planId);
    
    try {
      const response = await fetch('/api/creem-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { checkoutUrl } = await response.json();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating Creem checkout:', error);
      alert('支付失败，请重试');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            选择适合您的计划
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            从基础修复到专业级处理，我们为每个用户提供完美的解决方案
          </p>
        </div>

        {/* 价格卡片 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* 热门标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    🔥 最受欢迎
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* 计划名称和价格 */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* 功能列表 */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 订阅按钮 */}
                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                      : plan.id === 'basic'
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </div>
                  ) : plan.id === 'basic' ? (
                    '开始使用'
                  ) : (
                    '立即订阅'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            🔒 安全支付 • 随时取消 • 30天退款保证 • 全球税务合规
          </p>
          <div className="flex justify-center items-center space-x-6 text-gray-400 mb-4">
            <span>支持支付方式：</span>
            <div className="flex space-x-3">
              <span>💳 信用卡</span>
              <span>📱 微信支付</span>
              <span>💰 支付宝</span>
              <span>🪙 加密货币</span>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>🌍 100+ 国家支持</span>
            <span>•</span>
            <span>🛡️ AI 反欺诈保护</span>
            <span>•</span>
            <span>📊 由 Creem 提供支付服务</span>
          </div>
        </div>
      </div>
    </section>
  );
}
