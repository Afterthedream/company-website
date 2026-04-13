'use client'

import { useState, useEffect, useRef } from 'react'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { SolutionListSkeleton } from '@/components/Skeleton'
import { getSolutions, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'
import { defaultSolutions } from '@/lib/defaults'
import CtaSection from '@/components/CtaSection'

// Thin inline SVG decorators for each solution domain
const domainMarks = [
  // Water wave
  <svg key={0} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
    <path d="M4 32 Q12 24 20 32 Q28 40 36 32 Q44 24 48 32" strokeLinecap="round"/>
    <path d="M4 22 Q12 14 20 22 Q28 30 36 22 Q44 14 48 22" strokeLinecap="round" opacity="0.5"/>
    <path d="M4 12 Q12 4 20 12 Q28 20 36 12 Q44 4 48 12" strokeLinecap="round" opacity="0.25"/>
  </svg>,
  // Industrial pipe
  <svg key={1} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
    <rect x="6" y="18" width="36" height="12" rx="6"/>
    <path d="M18 18 V10 M30 18 V10" strokeLinecap="round"/>
    <path d="M18 30 V38 M30 30 V38" strokeLinecap="round"/>
    <circle cx="18" cy="10" r="3"/>
    <circle cx="30" cy="10" r="3"/>
  </svg>,
  // House + leaf
  <svg key={2} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
    <path d="M8 24 L24 10 L40 24" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 24 V38 H34 V24" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 34 Q36 28 36 20 Q28 20 26 28 Q24 36 30 34Z" fill="none"/>
  </svg>,
  // Shield + drop
  <svg key={3} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
    <path d="M24 6 L40 12 V26 C40 35 24 44 24 44 C24 44 8 35 8 26 V12 Z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 16 Q24 16 30 26 A6 6 0 0 1 18 26 Q24 16 24 16Z"/>
  </svg>,
  // Circuit / IoT
  <svg key={4} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
    <rect x="18" y="18" width="12" height="12" rx="2"/>
    <path d="M24 18 V8 M24 30 V40" strokeLinecap="round"/>
    <path d="M18 24 H8 M30 24 H40" strokeLinecap="round"/>
    <circle cx="8" cy="24" r="2.5" fill="currentColor" opacity="0.3"/>
    <circle cx="40" cy="24" r="2.5" fill="currentColor" opacity="0.3"/>
    <circle cx="24" cy="8" r="2.5" fill="currentColor" opacity="0.3"/>
    <circle cx="24" cy="40" r="2.5" fill="currentColor" opacity="0.3"/>
  </svg>,
]

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    getSolutions()
      .then(data => setSolutions(data))
      .catch(() => setSolutions([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, i]))
            obs.disconnect()
          }
        },
        { threshold: 0.08 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [loading])

  const displaySolutions = solutions.length > 0 ? solutions : defaultSolutions
  const hasDisplayData = displaySolutions.length > 0

  const handleToggle = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index))
  }

  return (
    <main className="min-h-screen" id="main-content">
      <PageHeader
        number="03"
        label="解决方案"
        title="专业解决方案"
        description="针对不同场景，提供专业的定制化解决方案"
      />

      <section className="py-24 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section intro line */}
          <div className="flex items-center gap-6 mb-16">
            <div className="h-px flex-1 bg-surface-100" />
            <span className="text-xs font-bold tracking-widest uppercase text-surface-300">SOLUTIONS</span>
            <div className="h-px flex-1 bg-surface-100" />
          </div>

          {loading ? (
            <SolutionListSkeleton count={5} />
          ) : hasDisplayData ? (
            <div>
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

                const defaults = defaultSolutions[index] || {}
                const isExpanded = expandedIndex === index
                const isVisible = visibleItems.has(index)
                const icon = domainMarks[index % domainMarks.length]
                const desc = parseRichText(solution.description) || solution.description || defaults.description || ''

                return (
                  <div
                    key={solution.id || index}
                    ref={el => { itemRefs.current[index] = el }}
                    className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                  >
                    {/* Top rule */}
                    <div className={`h-px w-full transition-colors duration-300 ${isExpanded ? 'bg-primary-300' : 'bg-surface-100'}`} />

                    <div
                      className="group"
                    >
                      {/* Main clickable row */}
                      <button
                        className="w-full text-left"
                        onClick={() => handleToggle(index)}
                        aria-expanded={isExpanded}
                        aria-controls={`solution-detail-${index}`}
                        aria-label="展开查看详情"
                      >
                        <div className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_1fr_auto] items-center gap-6 md:gap-10 py-8 md:py-10">

                          {/* Ordinal */}
                          <div className="self-start pt-1">
                            <span
                              className={`font-display text-2xl md:text-3xl font-bold leading-none select-none tabular-nums transition-colors duration-300 ${isExpanded ? 'text-primary-600' : 'text-surface-200'}`}
                            >
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>

                          {/* Title + description preview */}
                          <div className="space-y-1.5 min-w-0">
                            <h2
                              className="font-display text-xl md:text-2xl font-bold tracking-tight leading-snug text-surface-900 group-hover:text-primary-700 transition-colors duration-200"
                            >
                              {solution.title || defaults.title}
                            </h2>
                            <p className="text-sm text-surface-500 leading-relaxed line-clamp-1 md:line-clamp-none">
                              {desc}
                            </p>
                          </div>

                          {/* Toggle indicator */}
                          <div className="flex-shrink-0 flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isExpanded
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-surface-100 text-surface-500 group-hover:bg-primary-50 group-hover:text-primary-500'
                              }`}
                            >
                              <svg
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expandable detail panel */}
                      <div
                        id={`solution-detail-${index}`}
                        className="overflow-hidden"
                        style={{
                          display: 'grid',
                          gridTemplateRows: isExpanded ? '1fr' : '0fr',
                          transition: 'grid-template-rows 0.45s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      >
                        <div className="min-h-0">
                          <div className="grid md:grid-cols-[5rem_1fr_minmax(0,20rem)] gap-6 md:gap-10 pb-10">
                            {/* Left column: large domain icon */}
                            <div className="hidden md:flex items-start justify-center pt-1">
                              <div
                                className="w-12 h-12 text-primary-200"
                                aria-hidden="true"
                              >
                                {icon}
                              </div>
                            </div>

                            {/* Center: features */}
                            <div className="space-y-6">
                              {/* Feature list as inline markers */}
                              {featuresArray.length > 0 && (
                                <div>
                                  <p className="text-xs font-bold tracking-widest uppercase text-surface-300 mb-3">核心能力</p>
                                  <div className="space-y-2.5">
                                    {featuresArray.map((feature: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-3"
                                        style={{
                                          opacity: isExpanded ? 1 : 0,
                                          transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                          transition: `opacity 0.35s ease ${idx * 60 + 120}ms, transform 0.35s ease ${idx * 60 + 120}ms`,
                                        }}
                                      >
                                        <div className="w-1 h-1 rounded-full bg-primary-400 flex-shrink-0" />
                                        <span className="text-sm text-surface-600 font-medium">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* CTA */}
                              <div
                                style={{
                                  opacity: isExpanded ? 1 : 0,
                                  transition: `opacity 0.4s ease 0.35s`,
                                }}
                              >
                                <button
                                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group/btn"
                                  onClick={() => setSelectedItem(solution)}
                                  aria-label="查看完整方案"
                                >
                                  查看完整方案
                                  <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Right: image or accent block */}
                            <div
                              style={{
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateY(0)' : 'translateY(8px)',
                                transition: `opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s`,
                              }}
                            >
                              {solution.image ? (
                                <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-surface-50">
                                  <img
                                    src={typeof solution.image === 'string' ? solution.image : getStrapiMedia(solution.image?.url)}
                                    alt={solution.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full aspect-[4/3] rounded-xl bg-primary-50 flex items-center justify-center">
                                  <div className="w-20 h-20 text-primary-200" aria-hidden="true">
                                    {icon}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Final rule */}
              <div className="h-px w-full bg-surface-100" />
            </div>
          ) : null}

        </div>
      </section>

      <CtaSection
        title="没有找到合适的"
        highlightText="解决方案"
        description="联系我们，我们将根据您的需求提供定制化的解决方案"
        buttonText="联系我们"
        secondaryLink={{ href: "/products", text: "浏览产品" }}
      />

      {selectedItem && (
        <DetailModal item={selectedItem} type="solution" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
