'use client'

import { useState, useEffect, useRef } from 'react'
import { getSolutions } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultSolutions = [
  {
    title: '城市水环境治理',
    description: '为城市黑臭水体、污染河道提供系统性治理方案',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: '工业废水处理',
    description: '针对各类工业废水提供定制化处理解决方案',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: '农村污水治理',
    description: '为农村地区提供分散式、生态化污水处理方案',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
]

export default function Solutions() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    getSolutions().then(data => setSolutions(data)).catch(() => setSolutions([]))
  }, [])

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

  const displaySolutions = solutions.length > 0
    ? solutions.slice(0, 3).map((solution: any, index: number) => ({
        title: solution.title || defaultSolutions[index]?.title,
        description: parseRichText(solution.description) || solution.description || defaultSolutions[index]?.description,
        icon: defaultSolutions[index]?.icon,
      }))
    : defaultSolutions.slice(0, 3)

  return (
    <section ref={sectionRef} className="py-28 bg-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-32 right-0 w-72 h-72 bg-primary-50/50 rounded-full blur-[100px]" />
      <div className="absolute bottom-32 left-0 w-56 h-56 bg-surface-100/60 rounded-full blur-[80px]" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 标题 */}
        <div
          className={`text-center mb-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px bg-primary-300" />
            <span className="text-sm font-bold text-primary-600 tracking-widest uppercase">行业方案</span>
            <div className="w-10 h-px bg-primary-300" />
          </div>
          <h2 className="section-title">针对不同场景的专业方案</h2>
          <p className="section-subtitle mx-auto mt-4">
            从城市到农村，从工业到民生，覆盖全场景水治理需求
          </p>
        </div>

        {/* 横向列表布局 */}
        <div className="space-y-6">
          {displaySolutions.map((solution, index) => {
            const accentColors = [
              { bg: 'bg-primary-50', hoverBg: 'group-hover:bg-primary-600', text: 'text-primary-600', hoverBorder: 'hover:border-primary-300', gradient: 'from-primary-300 to-primary-100', hoverText: 'group-hover:text-primary-700' },
              { bg: 'bg-accent-50', hoverBg: 'group-hover:bg-accent-500', text: 'text-accent-600', hoverBorder: 'hover:border-accent-300', gradient: 'from-accent-300 to-accent-100', hoverText: 'group-hover:text-accent-700' },
              { bg: 'bg-warm-50', hoverBg: 'group-hover:bg-warm-500', text: 'text-warm-500', hoverBorder: 'hover:border-warm-300', gradient: 'from-warm-300 to-warm-100', hoverText: 'group-hover:text-warm-500' },
            ]
            const ac = accentColors[index % 3]
            return (
            <div
              key={index}
              className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${(index + 1) * 120}ms` }}
            >
              <div className={`flex flex-col md:flex-row md:items-center gap-6 p-7 rounded-2xl bg-white border border-surface-200 shadow-md hover:shadow-lg ${ac.hoverBorder} transition-all duration-300 transform hover:-translate-y-1`}>
                {/* 图标和编号 */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl ${ac.bg} flex items-center justify-center ${ac.text} ${ac.hoverBg} group-hover:text-white transition-all duration-300 shadow-sm`}>
                    {solution.icon}
                  </div>
                  <span className="text-[11px] font-mono text-surface-300">0{index + 1}</span>
                </div>

                {/* 内容 */}
                <div className="flex-1 space-y-3">
                  <h3 className={`text-xl font-semibold text-surface-900 ${ac.hoverText} transition-colors duration-200`}>
                    {solution.title}
                  </h3>
                  <p className="text-sm text-surface-400 leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                {/* 装饰元素 */}
                <div className={`flex-shrink-0 w-1 h-16 bg-gradient-to-b ${ac.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </div>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a
            href="/solutions"
            className="btn-primary"
          >
            查看全部解决方案
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
