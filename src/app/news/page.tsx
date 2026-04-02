'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { NewsListSkeleton } from '@/components/Skeleton'
import { getArticles, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

function NewsContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'industry'>('all')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [visibleCount, setVisibleCount] = useState(6)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const category = searchParams.get('category')
    if (category === 'company' || category === 'industry') {
      setActiveTab(category)
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getArticles()
        setArticles(data)
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  useEffect(() => {
    setVisibleCount(6)
  }, [activeTab])

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
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [loading])

  const hasArticles = articles.length > 0
  const filteredArticles = activeTab === 'all'
    ? articles
    : articles.filter((item: any) => item.category === activeTab)
  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  const tabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'company' as const, label: '公司新闻' },
    { key: 'industry' as const, label: '行业资讯' },
  ]

  return (
    <main className="min-h-screen animate-page-enter" id="main-content">
      <PageHeader
        number="05"
        label="新闻动态"
        title="最新资讯"
        description="了解公司最新资讯和行业动态"
      />

      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* 标签切换 */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex bg-surface-100 rounded-xl p-1" role="tablist" aria-label="新闻分类">
              {tabs.map((tab, tabIndex) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  aria-controls="news-tab-panel"
                  onClick={() => setActiveTab(tab.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      const next = tabs[(tabIndex + 1) % tabs.length]
                      setActiveTab(next.key)
                    } else if (e.key === 'ArrowLeft') {
                      const prev = tabs[(tabIndex - 1 + tabs.length) % tabs.length]
                      setActiveTab(prev.key)
                    }
                  }}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white text-surface-900 shadow-sm'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <NewsListSkeleton count={6} />
          ) : !hasArticles ? (
            <div id="news-tab-panel" role="tabpanel" className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">暂时还没有新闻哦</h3>
              <p className="text-sm text-surface-500">敬请期待后续更新~</p>
            </div>
          ) : (
            <div id="news-tab-panel" role="tabpanel">
              <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleArticles.map((item: any, index: number) => {
                  const cover = item.coverImage
                  const imgUrl = cover
                    ? getStrapiMedia(Array.isArray(cover) ? cover[0]?.url : cover?.url ?? null)
                    : item.image ?? null

                  return (
                    <article
                      key={item.id || index}
                      className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      }`}
                      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
                    >
                      <div className="card-surface overflow-hidden card-hover h-full">
                        <div className="aspect-[16/10] bg-surface-50 overflow-hidden">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-surface-100 flex items-center justify-center">
                              <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className={`px-2 py-0.5 rounded-md font-medium ${
                              item.category === 'company'
                                ? 'bg-primary-50 text-primary-600'
                                : 'bg-accent-50 text-accent-600'
                            }`}>
                              {item.category === 'company' ? '公司新闻' : '行业资讯'}
                            </span>
                            <span className="text-surface-500">
                              {new Date(item.publishedAt || item.date).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <h3 className="text-[15px] font-semibold text-surface-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
                            {item.title}
                          </h3>
                          <p className="text-sm text-surface-500 leading-relaxed line-clamp-2">
                            {parseRichText(item.excerpt) || item.excerpt || ''}
                          </p>
                          <button
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            onClick={() => setSelectedItem(item)}
                            aria-label={`阅读文章：${item.title}`}
                          >
                            阅读更多
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="btn-secondary"
                  >
                    加载更多
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <DetailModal item={selectedItem} type="news" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <PageHeader number="04" label="新闻动态" title="最新资讯" description="了解公司最新资讯和行业动态" />
        <section className="py-28 bg-surface-50">
          <div className="max-w-6xl mx-auto px-6">
            <NewsListSkeleton count={6} />
          </div>
        </section>
      </main>
    }>
      <NewsContent />
    </Suspense>
  )
}
