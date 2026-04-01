'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'
import DetailModal, { ModalItem } from '@/components/DetailModal'

interface CaseItem {
  id: number
  title: string
  client: string
  industry: string
  description: string
  results: string
  date: string
  coverImage?: any
}

interface CasesPreviewProps {
  cases?: CaseItem[]
}

const accentThemes = [
  { tag: 'bg-primary-50 text-primary-700 border-primary-100', dot: 'bg-primary-400', num: 'text-primary-100' },
  { tag: 'bg-accent-50 text-accent-600 border-accent-100', dot: 'bg-accent-400', num: 'text-accent-100' },
  { tag: 'bg-warm-50 text-warm-500 border-warm-100', dot: 'bg-warm-400', num: 'text-warm-100' },
]

export default function CasesPreview({ cases = [] }: CasesPreviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
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

  const hasCases = cases.length > 0
  const displayCases = cases.slice(0, 3).map((item: any) => ({
    id: item.id,
    title: item.title,
    client: item.client,
    industry: item.category || '其他',
    description: item.description,
    results: item.results || '',
    date: item.projectDate,
    coverImage: item.cover,
  }))

  return (
    <>
      <section ref={sectionRef} className="py-28 bg-surface-50 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-50/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-50/30 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto px-6 relative">
          {/* 标题区 */}
          <div
            className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                <span className="text-sm font-bold text-primary-600 tracking-widest uppercase">成功案例</span>
              </div>
              <h2 className="section-title">
                真实项目<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">看得见的效果</span>
              </h2>
            </div>
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group micro-interaction"
            >
              查看全部案例
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* 案例列表 */}
          {!hasCases ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-5 bg-surface-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-600 mb-2">暂时还没有案例哦</h3>
              <p className="text-sm text-surface-400">敬请期待后续更新~</p>
            </div>
          ) : (
            <div className="space-y-5">
              {displayCases.map((item, index) => {
                const theme = accentThemes[index % accentThemes.length]
                const coverImg = item.coverImage ? getStrapiMedia(
                  item.coverImage.data?.attributes?.url ||
                  (Array.isArray(item.coverImage.data) && item.coverImage.data.length > 0 ? item.coverImage.data[0]?.attributes?.url : null) ||
                  item.coverImage.url
                ) : null

                return (
                  <div
                    key={item.id || index}
                    className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col md:flex-row">
                        {/* 左侧：图片 */}
                        <div className="md:w-2/5 aspect-[4/3] md:aspect-auto bg-surface-100 overflow-hidden relative">
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
                              <svg className="w-12 h-12 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* 右侧：内容 */}
                        <div className="md:w-3/5 p-6 md:p-8 space-y-4">
                          {/* 标签 + 日期 */}
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 border rounded-lg text-xs font-medium ${theme.tag}`}>
                              {item.industry}
                            </span>
                            <span className="text-xs text-surface-400">
                              {item.date ? new Date(item.date).toLocaleDateString('zh-CN') : ''}
                            </span>
                          </div>

                          {/* 标题 */}
                          <h3 className="text-xl font-bold text-surface-900 group-hover:text-primary-700 transition-colors duration-200">
                            {item.title}
                          </h3>

                          {/* 客户 */}
                          {item.client && (
                            <p className="text-sm text-surface-500">
                              客户：<span className="font-medium text-surface-700">{item.client}</span>
                            </p>
                          )}

                          {/* 描述 */}
                          <p className="text-sm text-surface-500 leading-relaxed line-clamp-2">
                            {parseRichText(item.description) || item.description}
                          </p>

                          {/* 成果 */}
                          {item.results && (
                            <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              {item.results}
                            </div>
                          )}

                          {/* 查看详情 */}
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all duration-200 group-hover:translate-x-1"
                          >
                            查看详情
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 底部按钮 */}
          {hasCases && (
            <div
              className={`text-center mt-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/cases" className="btn-primary">
                查看更多案例
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <DetailModal item={selectedItem} type="solution" onClose={() => setSelectedItem(null)} />
      )}
    </>
  )
}
