'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { getArticles, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultArticles = [
  {
    id: 1,
    title: '公司成功完成某大型湖泊生态修复项目',
    excerpt: '该项目是我司迄今为止承接的最大的湖泊生态修复工程，标志着公司技术实力达到行业领先水平。',
    category: 'company',
    publishedAt: '2025-03-15',
  },
  {
    id: 2,
    title: '公司荣获"水处理行业十大品牌"称号',
    excerpt: '在第十届中国水处理行业峰会上，凭借卓越的技术实力和优质的服务荣获该殊荣。',
    category: 'company',
    publishedAt: '2025-03-10',
  },
  {
    id: 3,
    title: '2025年水处理行业发展趋势分析',
    excerpt: '随着环保政策的日益严格和技术的不断进步，水处理行业正迎来新的发展机遇。',
    category: 'industry',
    publishedAt: '2025-03-05',
  },
  {
    id: 4,
    title: '智慧水务系统助力城市水管理数字化转型',
    excerpt: '公司最新研发的智慧水务系统在某市成功上线，实现了水务管理的智能化和精细化。',
    category: 'company',
    publishedAt: '2025-02-28',
  },
  {
    id: 5,
    title: '新环保政策解读：水处理行业迎来新机遇',
    excerpt: '国家最新发布的环保政策为水处理行业带来了哪些发展机遇？本文将为您详细解读。',
    category: 'industry',
    publishedAt: '2025-02-20',
  },
  {
    id: 6,
    title: '公司技术团队参加国际水处理技术交流会',
    excerpt: '公司技术团队受邀参加在荷兰举办的国际水处理技术交流会，与全球专家共同探讨行业前沿技术。',
    category: 'company',
    publishedAt: '2025-02-15',
  },
]

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

  const displayArticles = articles.length > 0 ? articles : defaultArticles
  const filteredArticles = activeTab === 'all'
    ? displayArticles
    : displayArticles.filter((item: any) => item.category === activeTab)
  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  const tabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'company' as const, label: '公司新闻' },
    { key: 'industry' as const, label: '行业资讯' },
  ]

  return (
    <main className="min-h-screen">
      <Header />

      <PageHeader
        number="04"
        label="新闻动态"
        title="最新资讯"
        description="了解公司最新资讯和行业动态"
      />

      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* 标签切换 */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex bg-surface-100 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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
            <div className="text-center py-20">
              <p className="text-sm text-surface-400">加载中...</p>
            </div>
          ) : (
            <>
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
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100/50 flex items-center justify-center">
                              <svg className="w-10 h-10 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {item.category === 'company' ? '公司新闻' : '行业资讯'}
                            </span>
                            <span className="text-surface-400">
                              {new Date(item.publishedAt || item.date).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <h3 className="text-[15px] font-semibold text-surface-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
                            {item.title}
                          </h3>
                          <p className="text-sm text-surface-400 leading-relaxed line-clamp-2">
                            {parseRichText(item.excerpt) || item.excerpt || ''}
                          </p>
                          <button
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            onClick={() => setSelectedItem(item)}
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
            </>
          )}
        </div>
      </section>

      <Footer />

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
        <Header />
        <PageHeader number="04" label="新闻动态" title="最新资讯" description="了解公司最新资讯和行业动态" />
        <section className="py-28 bg-white"><div className="max-w-6xl mx-auto px-6 text-center"><p className="text-sm text-surface-400">加载中...</p></div></section>
        <Footer />
      </main>
    }>
      <NewsContent />
    </Suspense>
  )
}
