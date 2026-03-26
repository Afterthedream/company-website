'use client'

import { parseRichText } from '@/lib/richTextParser'

interface Company {
  id: number
  documentId: string
  name: string
  description: string | null
  vision: string | null
  mission: string | null
  values: string | null
}

interface HeroProps {
  company?: Company | null
}

export default function Hero({ company }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* 动态水波背景 */}
      <div className="absolute inset-0">
        {/* 大水滴 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        {/* 水波纹效果 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="water-ripple" />
        </div>

        {/* 小水滴装饰 */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 right-20 w-3 h-3 bg-primary-500/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-primary-300/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 文字内容 */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-none max-w-full mx-auto px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="block text-primary-600">{parseRichText(company?.vision)?.split('——')[0].trim() || '以水为脉，以智为器，以服为桥'}</span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/products" className="btn-primary">
                了解更多
              </a>
              <a href="/contact" className="btn-secondary">
                联系我们
              </a>
            </div>

            {/* 统计数据 */}
            {/* <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-600">20+</div>
                <div className="text-sm text-gray-600 mt-1">年行业经验</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600 mt-1">成功案例</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-600">98%</div>
                <div className="text-sm text-gray-600 mt-1">客户满意度</div>
              </div>
            </div> */}
          </div>

          {/* 水环形图案 */}
          <div className="relative flex items-center justify-center">
            <div className="w-80 h-80 md:w-96 md:h-96 relative">
              {/* 外环 */}
              <div className="absolute inset-0 border-4 border-primary-200/50 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              
              {/* 中环 */}
              <div className="absolute inset-8 border-4 border-primary-300/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              
              {/* 内环 */}
              <div className="absolute inset-16 border-4 border-primary-400/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              
              {/* 中心水滴 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-80 animate-pulse" />
              </div>

              {/* 环绕小水滴 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-primary-500 rounded-full animate-pulse" />
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-4 h-4 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 向下滚动提示 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
