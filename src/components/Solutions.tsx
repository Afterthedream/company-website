'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { getSolutions } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'
import { defaultSolutions as defaultSolutionsData } from '@/lib/defaults'
import DetailModal, { ModalItem } from '@/components/DetailModal'

const solutionIcons = [
  <svg key="city" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>,
  <svg key="industrial" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>,
  <svg key="rural" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>,
]

const defaultSolutions = defaultSolutionsData.map((item, i) => ({
  ...item,
  icon: solutionIcons[i] || solutionIcons[0],
  tags: item.features || [],
}))

const accentColors = [
  { num: 'text-primary-200 group-hover:text-primary-400', icon: 'text-primary-500 bg-primary-50', tag: 'bg-primary-50 text-primary-600', line: 'bg-primary-500' },
  { num: 'text-accent-200 group-hover:text-accent-400', icon: 'text-accent-500 bg-accent-50', tag: 'bg-accent-50 text-accent-600', line: 'bg-accent-500' },
  { num: 'text-warm-200 group-hover:text-warm-400', icon: 'text-warm-500 bg-warm-50', tag: 'bg-warm-50 text-warm-500', line: 'bg-warm-500' },
]

interface SolutionItem {
  title: string
  description: string
  icon: React.ReactNode
  tags: string[]
  features?: any
  cases?: any
  image?: any
  coverImage?: any
}

const SolutionCard = React.memo(({ solution, index, isVisible, hoveredIndex, onViewDetails, loading }: {
  solution: SolutionItem
  index: number
  isVisible: boolean
  hoveredIndex: number | null
  onViewDetails: (solution: SolutionItem) => void
  loading: boolean
}) => {
  const ac = accentColors[index % 3]
  const isHovered = hoveredIndex === index

  return (
    <div
      key={index}
      className={`group relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      role="listitem"
    >
      {/* 分隔线 */}
      <div className="border-t border-surface-100" />

      <div className="flex flex-col md:flex-row md:items-center gap-6 py-10 md:py-12 group cursor-default">
        {/* 大号编号 */}
        <div className="flex-shrink-0 hidden md:block">
          <span className={`font-display text-6xl lg:text-7xl font-extrabold ${ac.num} transition-colors duration-300 leading-none select-none`} aria-hidden="true">
            0{index + 1}
          </span>
        </div>

        {/* 内容区 */}
        <div className="flex-1 space-y-4">
          {/* 移动端编号 + 标题 */}
          <div className="flex items-center gap-4">
            <span className={`md:hidden font-display text-2xl font-extrabold ${ac.num} transition-colors duration-300`} aria-hidden="true">
              0{index + 1}
            </span>
            <div className={`w-10 h-10 rounded-xl ${ac.icon} flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} aria-hidden="true">
              {solution.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-surface-900 group-hover:text-surface-700 transition-colors duration-200">
              <span className="truncate">{solution.title}</span>
            </h3>
          </div>

          <p className="text-base text-surface-500 leading-relaxed max-w-xl line-clamp-2">
            {solution.description}
          </p>

          {/* 移动端详情按钮 */}
          <button
            onClick={() => onViewDetails(solution)}
            className="md:hidden inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 rounded"
            aria-label={`了解${solution.title}的详情`}
            disabled={loading}
          >
            {loading ? '加载中...' : '了解详情'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

        </div>

        {/* 箭头指示 */}
        <button
          onClick={() => onViewDetails(solution)}
          className={`flex-shrink-0 hidden md:flex items-center gap-2 min-h-[44px] px-2 text-sm font-medium text-surface-300 group-hover:text-primary-500 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''} focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 rounded`}
          aria-label={`了解${solution.title}的详情`}
          disabled={loading}
        >
          {loading ? '加载中...' : '了解详情'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* hover 时的左侧色条 */}
        <div className={`absolute left-0 w-1 h-16 ${ac.line} rounded-full transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
      </div>
    </div>
  )
})

SolutionCard.displayName = 'SolutionCard'

export default function Solutions() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchSolutions = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getSolutions()
        setSolutions(data)
      } catch (err) {
        console.error('Error fetching solutions:', err)
        setError('获取解决方案失败，请稍后重试')
        setSolutions([])
      } finally {
        setLoading(false)
      }
    }
    fetchSolutions()
  }, [])

  const handleViewDetails = useCallback(async (solution: any) => {
    setLoading(true)
    try {
      setSelectedItem(solution)
    } catch (err) {
      console.error('Error opening modal:', err)
      setError('打开详情失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
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
  const displaySolutions = useMemo(() => {
    return solutions.slice(0, 3).map((solution: any, index: number) => ({
      title: solution.title || defaultSolutions[index]?.title || '未命名方案',
      description: parseRichText(solution.description) || solution.description || defaultSolutions[index]?.description || '暂无描述',
      icon: defaultSolutions[index]?.icon,
      tags: defaultSolutions[index]?.tags || [],
      features: solution.features,
      cases: solution.cases,
      image: solution.image,
      coverImage: solution.coverImage,
    }))
  }, [solutions])

  return (
    <section 
      ref={sectionRef} 
      className="py-28 bg-white relative overflow-hidden"
      aria-labelledby="solutions-section-title"
    >
      {/* 背景装饰 */}
      <div className="absolute top-32 right-0 w-72 h-72 bg-primary-50/50 rounded-full blur-[100px]" aria-hidden="true" />
      <div className="absolute bottom-32 left-0 w-56 h-56 bg-accent-50/40 rounded-full blur-[80px]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 标题区 */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full" aria-hidden="true" />
              <span className="text-sm font-bold text-primary-600 tracking-widest uppercase">行业方案</span>
            </div>
            <h2
              id="solutions-section-title"
              className="section-title"
            >
              针对不同场景的<br />
              <span className="text-primary-600">专业方案</span>
            </h2>
          </div>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group micro-interaction focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 rounded"
            aria-label="查看全部方案"
          >
            查看全部方案
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* 编辑式列表布局 */}
        {loading ? (
          <div className="text-center py-16" role="status" aria-label="正在加载解决方案">
            <div className="w-16 h-16 mx-auto mb-5 bg-surface-100 rounded-full flex items-center justify-center animate-spin">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-600 mb-2">加载中...</h3>
            <p className="text-sm text-surface-400">正在获取解决方案数据</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 bg-surface-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.633-1.964-.633-2.732 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-600 mb-2">加载失败</h3>
            <p className="text-sm text-surface-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              重试
            </button>
          </div>
        ) : !hasSolutions ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 bg-surface-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-600 mb-2">暂时还没有解决方案哦</h3>
            <p className="text-sm text-surface-400">敬请期待后续更新~</p>
          </div>
        ) : (
        <div className="space-y-0" role="list">
          {displaySolutions.map((solution, index) => (
            <SolutionCard
              key={solution.title || index}
              solution={solution}
              index={index}
              isVisible={isVisible}
              hoveredIndex={hoveredIndex}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          ))}
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
