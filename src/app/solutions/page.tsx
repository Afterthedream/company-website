'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import CtaSection from '@/components/CtaSection'
import { SolutionListSkeleton } from '@/components/Skeleton'
import { getSolutions, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultSolutions = [
  {
    title: '城市水环境治理',
    description: '为城市黑臭水体、污染河道提供系统性治理方案，恢复城市水生态',
    features: ['黑臭水体治理', '河道生态修复', '雨污分流改造', '初期雨水处理'],
    cases: '已服务 30+ 城市，治理河道总长度超过 500 公里',
  },
  {
    title: '工业废水处理',
    description: '针对各类工业废水提供定制化处理解决方案，确保达标排放',
    features: ['化工废水处理', '电镀废水处理', '印染废水处理', '零排放系统'],
    cases: '服务 200+ 工业企业，达标率 99% 以上',
  },
  {
    title: '农村污水治理',
    description: '为农村地区提供分散式、生态化污水处理方案，助力美丽乡村建设',
    features: ['一体化处理设备', '人工湿地系统', '资源化利用', '智能运维'],
    cases: '覆盖 100+ 村庄，受益人口超过 50 万',
  },
  {
    title: '饮用水安全保障',
    description: '从水源地到水龙头的全流程饮用水安全保障体系',
    features: ['水源地保护', '水厂提标改造', '管网水质保障', '二次供水改造'],
    cases: '保障 500+ 万人饮水安全',
  },
  {
    title: '智慧水务建设',
    description: '运用物联网、大数据技术实现水务系统智能化管理',
    features: ['在线监测系统', '智能调度系统', '应急指挥系统', '移动应用平台'],
    cases: '建设 20+ 智慧水务平台',
  },
]

const accentThemes = [
  { num: 'text-primary-200', numHover: 'group-hover:text-primary-400', dot: 'bg-primary-400', tag: 'bg-primary-50 text-primary-700 border-primary-100', statIcon: 'text-primary-500', line: 'from-primary-400 to-primary-200' },
  { num: 'text-accent-200', numHover: 'group-hover:text-accent-400', dot: 'bg-accent-400', tag: 'bg-accent-50 text-accent-600 border-accent-100', statIcon: 'text-accent-500', line: 'from-accent-400 to-accent-200' },
  { num: 'text-warm-200', numHover: 'group-hover:text-warm-400', dot: 'bg-warm-400', tag: 'bg-warm-50 text-warm-500 border-warm-100', statIcon: 'text-warm-500', line: 'from-warm-400 to-warm-200' },
  { num: 'text-primary-200', numHover: 'group-hover:text-primary-400', dot: 'bg-primary-400', tag: 'bg-primary-50 text-primary-700 border-primary-100', statIcon: 'text-primary-500', line: 'from-primary-400 to-primary-200' },
  { num: 'text-accent-200', numHover: 'group-hover:text-accent-400', dot: 'bg-accent-400', tag: 'bg-accent-50 text-accent-600 border-accent-100', statIcon: 'text-accent-500', line: 'from-accent-400 to-accent-200' },
]

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getSolutions()
      .then(data => setSolutions(data))
      .catch(() => setSolutions([]))
      .finally(() => setLoading(false))
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
  }, [])

  const hasSolutions = solutions.length > 0
  const displaySolutions = solutions

  return (
    <main className="min-h-screen animate-page-enter">
      <Header />

      {/* 页面头部 */}
      <section className="pt-32 pb-20 bg-surface-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-50/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-bold text-primary-600 tracking-wider">03</span>
                <div className="w-8 h-px bg-primary-200" />
                <span className="text-xs font-semibold text-primary-600 tracking-widest uppercase">解决方案</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-extrabold text-surface-900 tracking-tight leading-tight">
                专业<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">解决方案</span>
              </h1>
            </div>
            <p className="text-lg text-surface-500 max-w-md leading-relaxed md:pb-2">
              针对不同行业场景，提供从规划到运维的全周期水治理解决方案
            </p>
          </div>
        </div>
      </section>

      {/* 解决方案列表 */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <SolutionListSkeleton count={3} />
          ) : !hasSolutions ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">暂时还没有解决方案哦</h3>
              <p className="text-sm text-surface-400">敬请期待后续更新~</p>
            </div>
          ) : (
          <div ref={listRef} className="space-y-0">
            {displaySolutions.map((solution: any, index: number) => {
              let featuresArray: string[] = []
              if (solution.features) {
                if (Array.isArray(solution.features)) {
                  featuresArray = solution.features.map((f: any) => parseRichText(f) || String(f))
                } else if (typeof solution.features === 'string') {
                  featuresArray = solution.features.split(',').map((f: string) => f.trim())
                }
              }
              if (featuresArray.length === 0 && defaultSolutions[index]) {
                featuresArray = defaultSolutions[index].features
              }

              const theme = accentThemes[index % accentThemes.length]
              const isHovered = hoveredIndex === index

              return (
                <div
                  key={solution.id || index}
                  className={`group transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* 顶部分隔线 */}
                  <div className="border-t border-surface-100" />

                  <div className="relative py-12 md:py-16 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                    {/* 左侧：编号 + 图片 */}
                    <div className="flex-shrink-0 lg:w-[340px] space-y-4">
                      {/* 大号编号 */}
                      <span className={`font-display text-7xl font-extrabold ${theme.num} ${theme.numHover} transition-colors duration-300 leading-none select-none`}>
                        0{index + 1}
                      </span>

                      {/* 图片区域 */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-50 border border-surface-100 relative group/img">
                        {(() => {
                          const img = solution.image || solution.coverImage
                          const imgUrl = img
                            ? Array.isArray(img) ? img[0]?.url : img?.url
                            : null
                          const fullUrl = imgUrl ? getStrapiMedia(imgUrl) : null
                          return fullUrl ? (
                            <img
                              src={fullUrl}
                              alt={solution.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                              <div className={`w-14 h-14 rounded-2xl ${theme.tag.split(' ')[0]} flex items-center justify-center ${theme.statIcon}`}>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-xs text-surface-400 font-medium">待上传图片</span>
                            </div>
                          )
                        })()}
                      </div>
                    </div>

                    {/* 右侧：内容 */}
                    <div className="flex-1 space-y-6 lg:pt-4">
                      {/* 标题 */}
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-surface-900 group-hover:text-surface-700 transition-colors duration-200">
                          {solution.title}
                        </h2>
                        <p className="text-base text-surface-500 leading-relaxed mt-2 max-w-2xl">
                          {parseRichText(solution.description) || solution.description || '提供专业的定制化解决方案'}
                        </p>
                      </div>

                      {/* 特性标签 */}
                      {featuresArray.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                          {featuresArray.map((feature: string, idx: number) => (
                            <span
                              key={idx}
                              className={`px-4 py-2 border rounded-xl text-sm font-medium ${theme.tag} transition-all duration-200 ${isHovered ? 'translate-y-[-2px]' : ''}`}
                              style={{ transitionDelay: `${idx * 50}ms` }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 案例数据 + 操作 */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                        {solution.cases && (
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center ${theme.statIcon}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <p className="text-sm text-surface-600 font-medium">
                              {parseRichText(solution.cases)}
                            </p>
                          </div>
                        )}

                        <button
                          className={`inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all duration-200 sm:ml-auto ${isHovered ? 'translate-x-1' : ''}`}
                          onClick={() => setSelectedItem(solution)}
                        >
                          了解详情
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* hover 时左侧色条 */}
                    <div className={`hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-20 bg-gradient-to-b ${theme.line} rounded-full transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
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

      <CtaSection 
        title="需要定制化的"
        highlightText="解决方案"
        description="联系我们，我们将根据您的需求，为您提供专业的定制化解决方案"
      />

      <Footer />

      {selectedItem && (
        <DetailModal item={selectedItem} type="solution" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
