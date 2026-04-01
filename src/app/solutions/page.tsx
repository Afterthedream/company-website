'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { getSolutions, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultSolutions = [
  {
    title: '城市水环境治理',
    description: '为城市黑臭水体、污染河道提供系统性治理方案',
    features: ['黑臭水体治理', '河道生态修复', '雨污分流改造', '初期雨水处理'],
    cases: '已服务 30+ 城市，治理河道总长度超过 500 公里',
  },
  {
    title: '工业废水处理',
    description: '针对各类工业废水提供定制化处理解决方案',
    features: ['化工废水处理', '电镀废水处理', '印染废水处理', '零排放系统'],
    cases: '服务 200+ 工业企业，达标率 99% 以上',
  },
  {
    title: '农村污水治理',
    description: '为农村地区提供分散式、生态化污水处理方案',
    features: ['一体化处理设备', '人工湿地系统', '资源化利用', '智能运维'],
    cases: '覆盖 100+ 村庄，受益人口超过 50 万',
  },
  {
    title: '饮用水安全保障',
    description: '从水源地到水龙头的全流程饮用水安全保障',
    features: ['水源地保护', '水厂提标改造', '管网水质保障', '二次供水改造'],
    cases: '保障 500+ 万人饮水安全',
  },
  {
    title: '智慧水务建设',
    description: '运用物联网、大数据技术实现水务智能化',
    features: ['在线监测系统', '智能调度系统', '应急指挥系统', '移动应用平台'],
    cases: '建设 20+ 智慧水务平台',
  },
]

const solutionIcons = [
  <svg key={0} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  <svg key={1} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  <svg key={2} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  <svg key={3} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  <svg key={4} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
]

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

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
      { threshold: 0.05 }
    )
    if (listRef.current) observer.observe(listRef.current)
    return () => observer.disconnect()
  }, [])

  const displaySolutions = solutions.length > 0 ? solutions : defaultSolutions

  return (
    <main className="min-h-screen">
      <Header />

      <PageHeader
        number="03"
        label="解决方案"
        title="专业解决方案"
        description="针对不同场景，提供专业的定制化解决方案"
      />

      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={listRef} className="space-y-12">
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

              const icon = solutionIcons[index % solutionIcons.length]

              return (
                <div
                  key={solution.id || index}
                  className={`group flex flex-col md:flex-row gap-8 items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                    {/* 图片/图标区域 */}
                    <div className="md:w-2/5 w-full aspect-video rounded-2xl overflow-hidden shadow-lg shadow-surface-200/20 bg-white">
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
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-surface-100">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-500">
                                {icon}
                              </div>
                              <span className="text-sm text-surface-400">暂无图片</span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    {/* 内容区域 */}
                    <div className="md:w-3/5 w-full space-y-5">
                      {/* 标题和描述 */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-mono text-primary-400">0{index + 1}</span>
                          <h2 className="text-2xl font-bold text-surface-900 group-hover:text-primary-700 transition-colors duration-200">
                            {solution.title}
                          </h2>
                        </div>
                        <p className="text-base text-surface-500 leading-relaxed">
                          {parseRichText(solution.description) || solution.description || '提供专业的定制化解决方案'}
                        </p>
                      </div>

                      {/* 特性标签 */}
                      {featuresArray.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {featuresArray.map((feature: string, idx: number) => (
                            <span key={idx} className="px-4 py-1.5 bg-white text-surface-700 text-xs font-medium rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 案例数据 */}
                      {solution.cases && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                          <p className="text-sm text-primary-600 font-medium">
                            {parseRichText(solution.cases)}
                          </p>
                        </div>
                      )}

                      {/* 了解详情按钮 */}
                      <button
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-all duration-200 group-hover:translate-x-1"
                        onClick={() => setSelectedItem(solution)}
                      >
                        了解详情
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-surface-900 overflow-hidden px-8 py-16 md:px-16 md:py-20 relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2">
                <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                  需要定制化的<span className="text-primary-300">解决方案</span>？
                </h2>
                <p className="text-sm text-surface-400">
                  我们的专业团队将根据您的具体需求，提供个性化的水治理解决方案
                </p>
              </div>
              <a href="/contact" className="group inline-flex items-center gap-2 bg-white text-surface-900 font-semibold text-sm py-3.5 px-8 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-black/10 flex-shrink-0">
                联系我们
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {selectedItem && (
        <DetailModal item={selectedItem} type="solution" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
