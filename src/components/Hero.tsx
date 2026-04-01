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

      {/* 水滴动画 — 装饰 */}
      <div className="absolute top-20 right-[15%] hidden lg:block">
        <div className="water-drop water-drop-delayed" />
      </div>
      <div className="absolute top-32 right-[25%] hidden lg:block">
        <div className="water-drop water-drop-delayed-2" />
      </div>

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
              className={`space-y-5 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-surface-900 leading-[1.05] tracking-tight">
                以水为脉<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500">以智为器</span>
              </h1>
              <p className="text-xl md:text-2xl text-surface-600 leading-relaxed max-w-xl font-medium">
                四川沧杰荇科技——一站式水利信息化问题解决者，
                让每一滴水都被精准守护。
              </p>
            </div>

            {/* 按钮组 */}
            <div
              className={`flex flex-col sm:flex-row gap-5 pt-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a href="/products" className="btn-primary text-base">
                查看适配方案
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="/contact" className="btn-secondary text-base">
                免费获取报价
              </a>
            </div>

          </div>

          {/* 动画水波 — 右 5 列 */}
          <div
            className={`hidden lg:flex lg:col-span-5 items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="relative w-[380px] h-[380px]">
              {/* 底层渐变圆 */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary-100/60 via-accent-50/40 to-primary-50/60 animate-breathe" />

              {/* SVG 水波动画 */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
                {/* 波浪 1 - 最外层 */}
                <path
                  className="hero-wave-1"
                  d="M200,60 C260,60 310,100 340,160 C370,220 340,300 280,340 C220,380 140,380 80,340 C20,300 -10,220 20,160 C50,100 140,60 200,60Z"
                  stroke="oklch(0.58 0.16 250 / 0.3)"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* 波浪 2 - 中层 */}
                <path
                  className="hero-wave-2"
                  d="M200,80 C250,80 290,110 315,160 C340,210 320,280 270,315 C220,350 150,350 100,315 C50,280 30,210 55,160 C80,110 150,80 200,80Z"
                  stroke="oklch(0.68 0.14 250 / 0.25)"
                  strokeWidth="1"
                  fill="none"
                />
                {/* 波浪 3 - 内层 */}
                <path
                  className="hero-wave-3"
                  d="M200,110 C240,110 270,130 290,170 C310,210 295,265 260,290 C225,315 175,315 140,290 C105,265 90,210 110,170 C130,130 160,110 200,110Z"
                  stroke="oklch(0.77 0.10 250 / 0.2)"
                  strokeWidth="1"
                  fill="oklch(0.77 0.10 250 / 0.03)"
                />

                {/* 涟漪扩散环 */}
                <circle className="ripple-ring-1" cx="200" cy="200" r="40" fill="none" stroke="oklch(0.58 0.16 250 / 0.4)" strokeWidth="1.5" />
                <circle className="ripple-ring-2" cx="200" cy="200" r="40" fill="none" stroke="oklch(0.58 0.16 250 / 0.3)" strokeWidth="1" />
                <circle className="ripple-ring-3" cx="200" cy="200" r="40" fill="none" stroke="oklch(0.58 0.16 250 / 0.2)" strokeWidth="0.8" />

                {/* 中心水滴 */}
                <g className="hero-drop">
                  {/* 水滴主体 - 椭圆形态变化 */}
                  <ellipse className="drop-body" cx="200" cy="200" rx="28" ry="30" fill="url(#heroGradient)" />
                  {/* 水滴高光 */}
                  <ellipse className="drop-highlight" cx="192" cy="192" rx="8" ry="10" fill="oklch(1 0 0 / 0.25)" />
                  {/* 水滴底部小水花 */}
                  <ellipse className="drop-splash" cx="200" cy="228" rx="12" ry="3" fill="oklch(0.58 0.16 250 / 0.15)" />
                </g>

                {/* 浮动气泡 */}
                <g className="hero-bubbles">
                  <circle className="bubble-1" cx="120" cy="280" r="4" fill="oklch(0.87 0.058 250 / 0.4)" />
                  <circle className="bubble-2" cx="280" cy="150" r="3" fill="oklch(0.87 0.07 190 / 0.4)" />
                  <circle className="bubble-3" cx="150" cy="120" r="5" fill="oklch(0.87 0.058 250 / 0.3)" />
                  <circle className="bubble-4" cx="300" cy="260" r="3.5" fill="oklch(0.90 0.09 85 / 0.4)" />
                  <circle className="bubble-5" cx="100" cy="180" r="3" fill="oklch(0.87 0.07 190 / 0.3)" />
                </g>

                {/* 渐变定义 */}
                <defs>
                  <radialGradient id="heroGradient" cx="0.4" cy="0.35">
                    <stop offset="0%" stopColor="oklch(0.78 0.10 250)" />
                    <stop offset="50%" stopColor="oklch(0.60 0.15 250)" />
                    <stop offset="100%" stopColor="oklch(0.42 0.13 250)" />
                  </radialGradient>
                </defs>
              </svg>

              {/* 环绕的数据点装饰 */}
              {[
                { top: '8%', left: '50%', delay: '0s' },
                { top: '30%', right: '5%', delay: '0.5s' },
                { bottom: '30%', right: '5%', delay: '1s' },
                { bottom: '8%', left: '50%', delay: '1.5s' },
                { bottom: '30%', left: '5%', delay: '2s' },
                { top: '30%', left: '5%', delay: '2.5s' },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary-400/40"
                  style={{
                    ...pos,
                    animation: `pulse 3s ease-in-out ${pos.delay} infinite`,
                  }}
                />
              ))}
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
        <div className="flex flex-col items-center gap-2 text-surface-400 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-6" viewBox="0 0 16 24" fill="none">
            <path d="M8 0C8 0 0 10 0 16C0 20.4183 3.58172 24 8 24C12.4183 24 16 20.4183 16 16C16 10 8 0 8 0Z" fill="oklch(0.70 0.12 250 / 0.2)" />
          </svg>
        </div>
      </div>
    </section>
  )
}
