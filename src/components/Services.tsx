'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { parseRichText } from '@/lib/richTextParser'

interface Product {
  id: number
  documentId: string
  name: string
  description: string | null
  features?: any
  order?: number
}

interface ServicesProps {
  products?: Product[]
}

const defaultServices = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: '水处理技术',
    description: '采用先进的水处理工艺，提供从源头到终端的全流程水净化解决方案。',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: '水生态修复',
    description: '运用生态工程方法，恢复水体自净能力，构建健康的水生态系统。',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: '智慧水务',
    description: '融合物联网、大数据技术，实现水务系统的智能化监控与管理。',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: '水环境监测',
    description: '建立完善的水环境监测体系，实时掌握水质动态变化。',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: '技术咨询',
    description: '提供专业的技术咨询服务，为客户量身定制最优解决方案。',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: '工程总包',
    description: '提供 EPC 工程总承包服务，从设计到施工一站式服务。',
  },
]

export default function Services({ products = [] }: ServicesProps) {
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
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const allServices = products.length > 0 ? products : defaultServices
  const services = allServices.slice(0, 3)

  return (
    <section ref={sectionRef} className="py-28 bg-surface-950 relative overflow-hidden">
      {/* 背景光晕（带色调，不是纯黑） */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-900/30 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-800/20 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 标题区 */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
              <span className="text-xs font-semibold text-primary-300 tracking-widest uppercase">核心业务</span>
            </div>
            <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-white tracking-tight leading-tight">
              产品与服务
            </h2>
          </div>
          <p className="text-sm text-surface-400 max-w-sm leading-relaxed">
            全方位水治理解决方案，满足不同客户的需求
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((item: any, index: number) => (
            <div
              key={item.id || index}
              className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${(index + 1) * 120}ms` }}
            >
              <div className="h-full p-7 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-200">
                {/* 编号 + 图标 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-300 group-hover:bg-primary-500/25 transition-colors duration-200">
                    {item.icon || defaultServices[0].icon}
                  </div>
                  <span className="text-xs font-mono text-surface-600">0{index + 1}</span>
                </div>

                {/* 标题 */}
                <h3 className="text-base font-semibold text-white mb-2">
                  {item.name || item.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-surface-400 leading-relaxed mb-5">
                  {parseRichText(item.description) || '提供专业的解决方案，满足您的各种需求。'}
                </p>

                {/* 链接 */}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-400 group-hover:text-primary-300 transition-colors"
                >
                  了解更多
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多 */}
        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary">
            查看所有产品
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
