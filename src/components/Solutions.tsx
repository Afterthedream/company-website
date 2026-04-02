'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getSolutions } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'
import DetailModal, { ModalItem } from '@/components/DetailModal'

const defaultSolutions = [
  {
    title: '城市水环境治理',
    description: '为城市黑臭水体、污染河道提供系统性治理方案',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    tags: ['黑臭水体', '河道治理', '生态修复'],
  },
  {
    title: '工业废水处理',
    description: '针对各类工业废水提供定制化处理解决方案',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    tags: ['电镀废水', '化工废水', '制药废水'],
  },
  {
    title: '农村污水治理',
    description: '为农村地区提供分散式、生态化污水处理方案',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    tags: ['分散处理', '人工湿地', '一体化设备'],
  },
]

export default function Solutions() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
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

  const hasSolutions = solutions.length > 0
  const displaySolutions = solutions.slice(0, 3).map((solution: any, index: number) => ({
    title: solution.title || defaultSolutions[index]?.title,
    description: parseRichText(solution.description) || solution.description || defaultSolutions[index]?.description,
    icon: defaultSolutions[index]?.icon,
    tags: defaultSolutions[index]?.tags || [],
    features: solution.features,
    cases: solution.cases,
    image: solution.image,
    coverImage: solution.coverImage,
  }))

  return (
    <section ref={sectionRef} className="py-28 bg-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-32 right-0 w-72 h-72 bg-primary-50/50 rounded-full blur-[100px]" />
      <div className="absolute bottom-32 left-0 w-56 h-56 bg-accent-50/40 rounded-full blur-[80px]" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 标题区 */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-sm font-bold text-primary-600 tracking-widest uppercase">行业方案</span>
            </div>
            <h2 className="section-title">
              针对不同场景的<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">专业方案</span>
            </h2>
          </div>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group micro-interaction"
          >
            查看全部方案
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* 编辑式列表布局 */}
        {!hasSolutions ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 bg-surface-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-600 mb-2">暂时还没有解决方案哦</h3>
            <p className="text-sm text-surface-400">敬请期待后续更新~</p>
          </div>
        ) : (
        <div className="space-y-0">
          {displaySolutions.map((solution, index) => {
            const accentColors = [
              { num: 'text-primary-200 group-hover:text-primary-400', icon: 'text-primary-500 bg-primary-50', tag: 'bg-primary-50 text-primary-600', line: 'bg-primary-500' },
              { num: 'text-accent-200 group-hover:text-accent-400', icon: 'text-accent-500 bg-accent-50', tag: 'bg-accent-50 text-accent-600', line: 'bg-accent-500' },
              { num: 'text-warm-200 group-hover:text-warm-400', icon: 'text-warm-500 bg-warm-50', tag: 'bg-warm-50 text-warm-500', line: 'bg-warm-500' },
            ]
            const ac = accentColors[index % 3]
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                className={`group transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 分隔线 */}
                <div className="border-t border-surface-100" />

                <div className="flex flex-col md:flex-row md:items-center gap-6 py-10 md:py-12 group cursor-default">
                  {/* 大号编号 */}
                  <div className="flex-shrink-0 hidden md:block">
                    <span className={`font-display text-6xl lg:text-7xl font-extrabold ${ac.num} transition-colors duration-300 leading-none select-none`}>
                      0{index + 1}
                    </span>
                  </div>

                  {/* 内容区 */}
                  <div className="flex-1 space-y-4">
                    {/* 移动端编号 + 标题 */}
                    <div className="flex items-center gap-4">
                      <span className={`md:hidden font-display text-2xl font-extrabold ${ac.num} transition-colors duration-300`}>
                        0{index + 1}
                      </span>
                      <div className={`w-10 h-10 rounded-xl ${ac.icon} flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                        {solution.icon}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-surface-900 group-hover:text-surface-700 transition-colors duration-200">
                        {solution.title}
                      </h3>
                    </div>

                    <p className="text-base text-surface-500 leading-relaxed max-w-xl">
                      {solution.description}
                    </p>

                    {/* 标签 */}
                    {solution.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {solution.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${ac.tag} transition-all duration-200`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 箭头指示 */}
                  <button
                    onClick={() => setSelectedItem(solution)}
                    className={`flex-shrink-0 hidden md:flex items-center gap-2 text-sm font-medium text-surface-300 group-hover:text-primary-500 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                  >
                    了解详情
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>

                  {/* hover 时的左侧色条 */}
                  <div className={`absolute left-0 w-1 h-16 ${ac.line} rounded-full transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            )
          })}
        </div>
        )}

        {/* 底部分隔线 */}
        <div className="border-t border-surface-100" />
      </div>

      {/* 详情弹窗 */}
      {selectedItem && (
        <DetailModal 
          item={selectedItem} 
          type="solution" 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </section>
  )
}
