'use client'

import { useState, useEffect } from 'react'
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const vision = parseRichText(company?.vision)?.split('——')[0].trim() || '以水为脉，以智为器，以服为桥'

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* 背景：偏冷调的浅色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-white to-primary-50/40" />

      {/* 装饰性网格 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, oklch(0.45 0.12 250) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 柔和光晕 */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-accent-200/25 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* 文字内容 — 左 7 列 */}
          <div className="lg:col-span-7 space-y-8">
            {/* 标签 */}
            <div
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-50 border border-accent-100 rounded-full text-xs font-semibold text-accent-600 tracking-wide">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
                水利信息化专家
              </span>
            </div>

            {/* 标题 */}
            <div
              className={`space-y-4 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-surface-900 leading-[1.1] tracking-tight">
                {vision}
              </h1>
              <p className="text-lg md:text-xl text-surface-500 leading-relaxed max-w-xl">
                四川沧杰荇科技有限公司——一站式水利信息化问题解决者，
                让每一滴水都被精准守护。
              </p>
            </div>

            {/* 按钮组 */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a href="/products" className="btn-primary">
                查看适配方案
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="/contact" className="btn-secondary">
                免费获取报价
              </a>
            </div>

          </div>

          {/* 装饰图形 — 右 5 列 */}
          <div
            className={`hidden lg:flex lg:col-span-5 items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative w-80 h-80">
              {/* 外环 */}
              <div className="absolute inset-0 rounded-full border border-primary-200/40 animate-spin-slow" />
              {/* 中环 */}
              <div className="absolute inset-6 rounded-full border border-dashed border-primary-300/30 animate-spin-reverse-slow" />
              {/* 内环 */}
              <div className="absolute inset-14 rounded-full border border-primary-200/20 animate-spin-slow" />

              {/* 中心实心圆 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg" />
              </div>

              {/* 轨道上的点 */}
              {[
                { pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', size: 'w-3 h-3', color: 'bg-primary-500' },
                { pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', size: 'w-2 h-2', color: 'bg-accent-400' },
                { pos: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', size: 'w-2.5 h-2.5', color: 'bg-accent-300' },
                { pos: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2', size: 'w-2 h-2', color: 'bg-primary-400' },
              ].map((dot, i) => (
                <div key={i} className={`absolute ${dot.pos} ${dot.size} ${dot.color} rounded-full`} />
              ))}

              {/* 装饰弧线 */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" fill="none">
                <path
                  d="M160 20C160 20 240 80 280 160C320 240 240 300 160 300"
                  stroke="oklch(0.8 0.06 240)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="6 6"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 向下滚动提示 */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 delay-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-surface-400">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-surface-300 to-transparent" />
        </div>
      </div>
    </section>
  )
}
