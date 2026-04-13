'use client'

import React, { useState, useEffect, useRef } from 'react'
import PageHeader from '@/components/PageHeader'
import DetailModal from '@/components/DetailModal'
import { CaseListSkeleton } from '@/components/Skeleton'
import { getStrapiMedia, getCases } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

interface CaseItem {
  id: number
  title: string
  client: string
  industry: string
  description: string
  results: string
  date: string
  coverImage: any
  content: any
}

const accentThemes = [
  { tag: 'bg-primary-50 text-primary-700 border-primary-100', dot: 'bg-primary-400' },
  { tag: 'bg-accent-50 text-accent-600 border-accent-100', dot: 'bg-accent-400' },
  { tag: 'bg-warm-50 text-warm-500 border-warm-100', dot: 'bg-warm-400' },
]

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<CaseItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // 数据获取
  React.useEffect(() => {
    async function fetchCases() {
      try {
        const data = await getCases()
        setCases(data)
      } catch (error) {
        console.error('Error fetching cases:', error)
        setCases([])
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    if (listRef.current) observer.observe(listRef.current)
    return () => observer.disconnect()
  }, [loading])

  const hasCases = cases.length > 0
  const displayCases = cases.map((item: any) => ({
    id: item.id,
    title: item.title,
    client: item.client,
    industry: (item.category && item.category !== 'river') ? item.category : '其他',
    description: item.description,
    results: item.results || '',
    date: item.projectDate,
    coverImage: item.cover,
    location: item.location
  }))

  const handleOpenModal = (caseItem: CaseItem) => {
    setSelectedItem(caseItem)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <main className="min-h-screen animate-page-enter" id="main-content">
      <PageHeader
        number="04"
        label="应用案例"
        title="成功案例展示"
        description="真实项目，看得见的效果——每一个案例都是专业实力的见证"
      />

      {/* 案例列表 */}
      <section className="py-28 bg-surface-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative">
          {loading ? (
            <CaseListSkeleton count={3} />
          ) : !hasCases ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">暂时还没有案例哦</h3>
              <p className="text-sm text-surface-500">敬请期待后续更新~</p>
            </div>
          ) : (
          <div ref={listRef} className="space-y-0">
            {displayCases.map((item: any, index: number) => {
              const theme = accentThemes[index % 3]
              const coverImg = item.coverImage ? getStrapiMedia(
                item.coverImage.url || null
              ) : null

              return (
                <div
                  key={item.id || index}
                  className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* 顶部分隔线 */}
                  <div className="border-t border-surface-100" />

                  <div className="relative py-12 md:py-16 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                    {/* 左侧：编号 + 图片 */}
                    <div className="flex-shrink-0 lg:w-full lg:max-w-[340px] space-y-4">
                      <span className="font-display text-7xl font-extrabold text-surface-100 group-hover:text-primary-200 transition-colors duration-300 leading-none select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* 图片区域 */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-50 border border-surface-100">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-500">
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs text-surface-500 font-medium">待上传图片</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 右侧：内容 */}
                    <div className="flex-1 space-y-5 lg:pt-4">
                      {/* 日期 */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-surface-500">
                          {item.date ? new Date(item.date).toLocaleDateString('zh-CN') : '日期待定'}
                        </span>
                      </div>

                      {/* 标题 */}
                      <h2 className="text-2xl md:text-3xl font-bold text-surface-900 group-hover:text-surface-700 transition-colors duration-200">
                        {item.title}
                      </h2>

                      {/* 客户 */}
                      <p className="text-sm text-surface-500">
                        客户：<span className="font-medium text-surface-700">{item.client || '未知客户'}</span>
                      </p>

                      {/* 描述 */}
                      <p className="text-base text-surface-500 leading-relaxed max-w-2xl">
                        {parseRichText(item.description) || item.description || '暂无描述'}
                      </p>

                      {/* 成果 */}
                      {item.results && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 border border-surface-100">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">项目成果</span>
                            <p className="text-sm text-surface-700 font-medium mt-1">{item.results}</p>
                          </div>
                        </div>
                      )}

                      {/* 操作 */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          aria-label={`查看${item.title}的详情`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all duration-200 group-hover:translate-x-1 cursor-pointer"
                        >
                          查看详情
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* hover 时的左侧色条 */}
                    <div className={`absolute left-0 w-1 h-16 ${theme.dot} rounded-full transition-all duration-300 group-hover:opacity-100 opacity-0`} aria-hidden="true" />
                  </div>
                </div>
              )
            })}
          </div>
          )}

          {/* 底部分隔线 */}
          <div className="border-t border-surface-100" />
        </div>
      </section>

      {/* 详情模态框 */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={handleCloseModal}
          type="case"
        />
      )}
    </main>
  )
}
