'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function CtaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`relative rounded-3xl bg-surface-900 overflow-hidden px-8 py-16 md:px-16 md:py-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* 装饰光晕 */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/8 rounded-full blur-[80px]" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* 左 */}
            <div className="text-center lg:text-left space-y-4 max-w-lg">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                需要专业的<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-accent-300">水治理方案</span>？
              </h2>
              <p className="text-base text-surface-300 leading-relaxed">
                我们的专业团队将根据您的具体需求，提供个性化的定制化解决方案
              </p>
            </div>

            {/* 右 */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 bg-white text-surface-900 font-bold text-base py-4 px-10 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-black/10 active:scale-[0.97]"
              >
                免费咨询方案
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="text-base text-surface-400 hover:text-white transition-colors font-semibold"
              >
                浏览产品 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
