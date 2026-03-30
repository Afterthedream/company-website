'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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

interface AboutPreviewProps {
  company?: Company | null
  companyImage?: string | null
}

export default function AboutPreview({ company, companyImage }: AboutPreviewProps) {
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
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const values = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: '企业愿景',
      text: company?.vision,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '企业使命',
      text: company?.mission,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: '核心价值观',
      text: company?.values,
    },
  ]

  return (
    <section ref={sectionRef} className="py-28 bg-surface-50 relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/60 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 区域标签 */}
        <div
          className={`flex items-center gap-3 mb-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <span className="font-display text-sm font-bold text-primary-600 tracking-wider">01</span>
          <div className="w-10 h-px bg-primary-300" />
          <span className="text-sm text-surface-400">关于我们</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* 图片区 */}
          <div
            className={`relative transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden bg-surface-100 aspect-[4/3]">
              {companyImage ? (
                <img src={companyImage} alt="公司照片" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-surface-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* 装饰边框 */}
            <div className="absolute -bottom-3 -left-3 w-full h-full rounded-2xl border border-primary-100 -z-10" />
          </div>

          {/* 文字区 */}
          <div
            className={`space-y-8 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}
          >
            <div className="space-y-4">
              <h2 className="section-title">
                以水为脉，以智为器
              </h2>
              <p className="text-surface-500 leading-relaxed text-[15px]">
                {parseRichText(company?.description) || '智汇泽润是一家专注于水资源治理与保护的科技企业，秉承"道法自然、上善若水"的理念，致力于为客户提供专业、高效、环保的水治理解决方案。'}
              </p>
            </div>

            {/* 三列理念 */}
            {values.some(v => v.text) && (
              <div className="grid gap-3">
                {values.filter(v => v.text).map((item, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-800 mb-0.5">{item.title}</h3>
                      <p className="text-sm text-surface-400 leading-relaxed">{parseRichText(item.text)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
            >
              了解更多
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
