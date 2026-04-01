'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

interface Article {
  id: number
  documentId: string
  title: string
  excerpt: string | null
  category: string
  publishedAt: string
  coverImage?: any
}

interface NewsPreviewProps {
  articles?: Article[]
}

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
]

export default function NewsPreview({ articles = [] }: NewsPreviewProps) {
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

  const displayArticles = articles.length > 0 ? articles.slice(0, 3) : defaultArticles

  return (
    <section ref={sectionRef} className="py-28 bg-surface-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-50/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-surface-100/60 rounded-full blur-[80px]" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 标题区 */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              <span className="text-xs font-semibold text-primary-600 tracking-widest uppercase">新闻动态</span>
            </div>
            <h2 className="section-title">最新资讯</h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group micro-interaction"
          >
            查看全部
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* 文章列表 */}
        <div className="grid md:grid-cols-3 gap-8">
          {displayArticles.map((article: any, index: number) => {
            // 获取封面图
            const cover = article.coverImage
            const imgUrl = cover
              ? getStrapiMedia(Array.isArray(cover) ? cover[0]?.url : cover?.url ?? null)
              : null

            return (
              <article
                key={article.id || index}
                className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${(index + 1) * 120}ms` }}
              >
                <Link href="/news" className="block">
                  <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* 封面图 */}
                    <div className="aspect-[16/10] bg-surface-100 overflow-hidden">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100/50 flex items-center justify-center">
                          <svg className="w-10 h-10 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className={`px-2.5 py-1 rounded-md font-medium ${
                          article.category === 'company'
                            ? 'bg-primary-50 text-primary-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {article.category === 'company' ? '公司新闻' : '行业资讯'}
                        </span>
                        <span className="text-surface-400">
                          {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-surface-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
                        {article.title}
                      </h3>
                      <p className="text-sm text-surface-400 leading-relaxed line-clamp-2">
                        {parseRichText(article.excerpt) || article.excerpt || ''}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
                        阅读更多
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
