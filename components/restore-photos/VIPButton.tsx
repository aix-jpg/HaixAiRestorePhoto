import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  priceId: string;
}

export default function VIPButton() {
  const { t } = useTranslation('common');
  const [showVIPModal, setShowVIPModal] = useState(false);
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
      priceId: 'sanhai_pro_monthly'
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
      priceId: 'sanhai_enterprise_monthly'
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
          cancelUrl: `${window.location.origin}/`,
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
    <>
      {/* VIP 按钮 */}
      <button
        onClick={() => setShowVIPModal(true)}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2 shadow-lg text-sm font-medium"
      >
        <span className="text-lg">👑</span>
        <span>VIP</span>
      </button>

      {/* VIP 弹窗 */}
      {showVIPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👑</span>
                <h2 className="text-2xl font-bold text-gray-900">升级到 VIP</h2>
              </div>
              <button
                onClick={() => setShowVIPModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  解锁无限 AI 照片修复能力，享受专业级处理效果
                </p>
              </div>

              {/* 价格卡片 */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      plan.popular 
                        ? 'border-orange-500 scale-105 shadow-lg' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {/* 热门标签 */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          🔥 最受欢迎
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* 计划名称和价格 */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold text-gray-900">
                            {plan.price}
                          </span>
                          <span className="text-gray-500 ml-1">
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      {/* 功能列表 */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 text-sm ${
                          plan.popular
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg'
                            : plan.id === 'basic'
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading === plan.id ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </div>
                        ) : plan.id === 'basic' ? (
                          '开始使用'
                        ) : (
                          '立即升级'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部说明 */}
              <div className="text-center">
                <p className="text-gray-500 mb-4 text-sm">
                  🔒 安全支付 • 随时取消 • 30天退款保证 • 全球税务合规
                </p>
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-400 mb-2">
                  <span>支持支付：💳 信用卡 📱 微信 💰 支付宝 🪙 加密货币</span>
                </div>
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
                  <span>🌍 100+ 国家支持</span>
                  <span>•</span>
                  <span>🛡️ AI 反欺诈保护</span>
                  <span>•</span>
                  <span>📊 由 Creem 提供支付服务</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
