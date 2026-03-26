'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { getArticles, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

interface Article {
  id: number
  documentId: string
  title: string
  excerpt: string | null
  content?: any
  category: string
  publishedAt: string
  image?: any
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'industry'>('all')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  
  // 分页状态
  const [visibleCount, setVisibleCount] = useState(6)

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

  // 切换标签时重置显示数量
  useEffect(() => {
    setVisibleCount(6)
  }, [activeTab])

  // 默认数据（当 Strapi 没有数据时显示）
  const defaultArticles = [
    {
      id: 1,
      title: '智汇泽润成功完成某大型湖泊生态修复项目',
      excerpt: '该项目是我司迄今为止承接的最大的湖泊生态修复工程，标志着公司技术实力达到行业领先水平...',
      date: '2024-03-15',
      category: 'company',
      image: 'https://via.placeholder.com/800x600/e0f2fe/0284c7?text=News+1',
    },
    {
      id: 2,
      title: '公司荣获"水处理行业十大品牌"称号',
      excerpt: '在第十届中国水处理行业峰会上，智汇泽润凭借卓越的技术实力和优质的服务荣获该殊荣...',
      date: '2024-03-10',
      category: 'company',
      image: 'https://via.placeholder.com/800x600/e0f2fe/0284c7?text=News+2',
    },
    {
      id: 3,
      title: '2024 年水处理行业发展趋势分析',
      excerpt: '随着环保政策的日益严格和技术的不断进步，水处理行业正迎来新的发展机遇...',
      date: '2024-03-05',
      category: 'industry',
      image: 'https://via.placeholder.com/800x600/e0f2fe/0284c7?text=News+3',
    },
    {
      id: 4,
      title: '智慧水务系统助力城市水管理数字化转型',
      excerpt: '公司最新研发的智慧水务系统在某市成功上线，实现了水务管理的智能化和精细化...',
      date: '2024-02-28',
      category: 'company',
      image: 'https://via.placeholder.com/800x600/e0f2fe/0284c7?text=News+4',
    },
    {
      id: 5,
      title: '新环保政策解读：水处理行业迎来新机遇',
      excerpt: '国家最新发布的环保政策为水处理行业带来了哪些发展机遇？本文将为您详细解读...',
      date: '2024-02-20',
      category: 'industry',
      image: 'https://via.placeholder.com/800x600/e0f2fe/0284c7?text=News+5',
    },
    {
      id: 6,
      title: '公司技术团队参加国际水处理技术交流会',
      excerpt: '公司技术团队受邀参加在荷兰举办的国际水处理技术交流会，与全球专家共同探讨行业前沿技术...',
      date: '2024-02-15',
      category: 'company',
      image: 'https://via.placeholder.com/800x600/e0f2fe/0284c7?text=News+6',
    },
  ]

  // 使用 Strapi 数据或默认数据
  const displayArticles = articles.length > 0 ? articles : defaultArticles

  // 过滤文章
  const filteredArticles = activeTab === 'all' 
    ? displayArticles 
    : displayArticles.filter(item => item.category === activeTab)

  // 限制显示数量
  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  // 加载更多处理函数
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* 页面头部 */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              新闻动态
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              了解公司最新资讯和行业动态
            </p>
          </div>
        </div>
      </section>

      {/* 新闻列表 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 标签切换 */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-primary-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setActiveTab('company')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'company'
                    ? 'bg-white text-primary-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                公司新闻
              </button>
              <button
                onClick={() => setActiveTab('industry')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === 'industry'
                    ? 'bg-white text-primary-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                行业资讯
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600">正在加载新闻...</p>
            </div>
          ) : (
            <>
              {/* 新闻网格 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleArticles.map((item: any, index: number) => (
                  <article
                    key={item.id || index}
                    className="bg-white rounded-2xl overflow-hidden shadow-md card-hover border border-gray-100"
                  >
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      {(() => {
                        // 从 coverImage 字段取图片 URL（支持单张和多张）
                        const cover = item.coverImage
                        const imgUrl = cover
                          ? getStrapiMedia(
                              Array.isArray(cover)
                                ? cover[0]?.url
                                : cover?.url ?? null
                            )
                          : item.image ?? null

                        return imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <svg className="w-16 h-16 text-primary-400/50" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                              <path d="M7 7h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 15h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
                            </svg>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.category === 'company'
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {item.category === 'company' ? '公司新闻' : '行业资讯'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(item.publishedAt || item.date).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {parseRichText(item.excerpt) || item.excerpt || '点击阅读更多精彩内容...'}
                      </p>
                      <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                        onClick={() => setSelectedItem(item)}
                      >
                        阅读更多
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* 加载更多 */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button 
                    onClick={handleLoadMore}
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

      {/* 详情弹窗 */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type="news"
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  )
}
