'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSolutionBySlug, getStrapiMedia } from '@/lib/strapi'
import { parseRichText, parseFeatures } from '@/lib/richTextParser'
import { defaultSolutions } from '@/lib/defaults'
import StrapiBlocks from '@/components/StrapiBlocks'
import CtaSection from '@/components/CtaSection'

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

/* ------------------------------------------------------------------ */
/*  Feature icons                                                      */
/* ------------------------------------------------------------------ */
const featureIconMap: Record<string, React.ReactNode> = {
  // 水务
  water:    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>,
  flood:    <><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M2 19c6.667-6 13.333 0 20-6"/></>,
  pump:     <><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M12 8v4"/><path d="M9 12h6"/></>,
  pipeline: <path d="M3 12h4l3-9 4 18 3-9h4"/>,
  // 数据/平台
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
  platform: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></>,
  cloud:    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>,
  // 监测/感知
  sensor:   <><path d="M2 12a5 5 0 015-5"/><path d="M7 7a5 5 0 015 5"/><path d="M22 12a5 5 0 01-5 5"/><path d="M17 17a5 5 0 01-5-5"/><circle cx="12" cy="12" r="1"/></>,
  monitor:  <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  // 地图/GIS
  map:      <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
  gis:      <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
  // 网络/通信
  network:  <><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></>,
  iot:      <><path d="M12 2a4 4 0 014 4"/><path d="M12 2a4 4 0 00-4 4"/><path d="M20 12a4 4 0 01-4 4"/><path d="M4 12a4 4 0 014-4"/><circle cx="12" cy="12" r="2"/></>,
  // 硬件/设备
  hardware: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M1 9h3"/><path d="M1 15h3"/><path d="M20 9h3"/><path d="M20 15h3"/></>,
  device:   <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
  chip:     <><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M1 9h3"/><path d="M1 15h3"/><path d="M20 9h3"/><path d="M20 15h3"/><path d="M4 4l3 3"/><path d="M17 17l3 3"/><path d="M4 20l3-3"/><path d="M17 7l3-3"/></>,
  // 告警/安全
  alert:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  // 分析/图表
  chart:    <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  analysis: <><path d="M21 12a9 9 0 11-6.219-8.56"/><polyline points="22 2 22 8 16 8"/></>,
  // 环保/治理
  recycle:  <><path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 000-1.775l-1.226-2.12"/><path d="M14 16l3 3-3 3"/></>,
  // 通用
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
}

// 默认 icon（当没有匹配时显示一个通用小圆点）
const defaultIcon = <circle cx="12" cy="12" r="4" />

function FeatureIcon({ name }: { name?: string }) {
  const d = name ? featureIconMap[name.toLowerCase().trim()] : null
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      {d || defaultIcon}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Scroll-reveal                                                      */
/* ------------------------------------------------------------------ */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect() } }, { threshold })
    o.observe(el); return () => o.disconnect()
  }, [threshold])
  return { ref, vis }
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, vis } = useReveal(0.08)
  return (
    <div ref={ref} className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section label                                                      */
/* ------------------------------------------------------------------ */
function Label({ text }: { text: string }) {
  return (
    <h2 className="font-display text-lg font-bold text-[#0c4a6e] dark:text-[#7dd3fc] border-l-4 border-[#0369a1] dark:border-[#38bdf8] pl-3.5 mb-5 leading-snug">{text}</h2>
  )
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */
function Skeleton() {
  return (
    <main className="min-h-screen bg-surface-100 dark:bg-surface-950" id="main-content">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        <div className="h-4 w-28 bg-surface-200 dark:bg-surface-800 rounded animate-pulse mb-6" />
        <div className="rounded-xl overflow-hidden shadow-lg">
          <div className="h-44 bg-surface-300 dark:bg-surface-700 animate-pulse" />
          <div className="bg-white dark:bg-surface-900 p-8 lg:p-10 space-y-6">
            <div className="h-5 w-32 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />
            <div className="h-12 w-full bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
            <div className="h-4 w-2/3 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />
            <div className="h-px bg-surface-100 dark:bg-surface-800" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/*  404                                                                */
/* ------------------------------------------------------------------ */
function NotFound() {
  return (
    <main className="min-h-screen bg-surface-100 dark:bg-surface-950 flex items-center justify-center" id="main-content">
      <div className="text-center px-6 max-w-sm">
        <p className="text-6xl font-display font-bold text-surface-200 dark:text-surface-800 mb-4">404</p>
        <h1 className="font-display text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">方案未找到</h1>
        <p className="text-sm text-surface-500 mb-8">该解决方案可能已被移除或链接无效</p>
        <Link href="/solutions" className="btn-primary inline-flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          返回解决方案
        </Link>
      </div>
    </main>
  )
}

/* ================================================================== */
/*  MAIN                                                               */
/* ================================================================== */
export default function SolutionDetailClient() {
  const { slug } = useParams<{ slug: string }>()
  const [solution, setSolution] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    const run = async () => {
      setLoading(true)
      try {
        const data = await getSolutionBySlug(slug)
        if (data) { setSolution(data) }
        else {
          const fb = defaultSolutions.find(d => slugify(d.title) === slug)
          fb ? setSolution(fb) : setNotFound(true)
        }
      } catch {
        const fb = defaultSolutions.find(d => slugify(d.title) === slug)
        fb ? setSolution(fb) : setNotFound(true)
      } finally { setLoading(false) }
    }
    run()
  }, [slug])

  if (loading) return <Skeleton />
  if (notFound || !solution) return <NotFound />

  const title       = solution.title || '未命名方案'
  const subtitle    = solution.subtitle || ''
  const description = parseRichText(solution.description) || solution.description || ''
  const background  = solution.background || null
  const challenges  = solution.challenges || null
  const featureList = parseFeatures(solution.features)
  const highlights  = solution.highlights || null
  const cases       = solution.cases || null
  const coverImg    = solution.image
    ? (typeof solution.image === 'string' ? solution.image : getStrapiMedia(solution.image?.url))
    : null

  const hasBg    = !!background
  const hasCh    = !!challenges
  const hasCt    = !!solution.content
  const hasHi    = !!highlights
  const hasFeat  = featureList.length > 0
  const hasCases = !!cases

  /* ---- ordered section list for sidebar ---- */
  const sections: { id: string; label: string }[] = []
  if (hasBg)    sections.push({ id: 'background', label: '项目背景' })
  if (hasCh)    sections.push({ id: 'challenges', label: '挑战与目标' })
  if (hasCt)    sections.push({ id: 'solution',   label: '解决方案' })
  if (hasHi)    sections.push({ id: 'highlights', label: '方案亮点' })
  if (hasFeat)  sections.push({ id: 'features',   label: '核心能力' })
  if (hasCases) sections.push({ id: 'cases',      label: '典型案例' })

  return (
    <main className="min-h-screen bg-surface-100 dark:bg-surface-950" id="main-content">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-12">

        {/* Back */}
        <Link href="/solutions" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors mb-6 group">
          <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          返回
        </Link>

        {/* Card container */}
        <div className="rounded-xl overflow-hidden shadow-lg dark:shadow-2xl dark:shadow-black/30">

          {/* ---- Gradient hero header ---- */}
          <header className="relative bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-white px-8 lg:px-10 py-10 lg:py-12">
            {coverImg && (
              <div className="absolute inset-0 opacity-[0.12]">
                <img src={coverImg} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="relative">
              <span className="inline-block text-xs font-bold tracking-widest uppercase opacity-70 mb-3">解决方案</span>
              {subtitle && <p className="text-sm font-medium opacity-80 mb-2">{subtitle}</p>}
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">{title}</h1>
              {description && <p className="mt-3 text-sm opacity-80 leading-relaxed max-w-2xl">{description}</p>}
              {sections.length > 0 && (
                <nav className="flex flex-wrap gap-2 mt-5" aria-label="页面导航">
                  {sections.map(s => (
                    <a key={s.id} href={`#${s.id}`} className="px-3 py-1 text-xs font-medium bg-white/15 hover:bg-white/25 rounded-md transition-colors backdrop-blur-sm">
                      {s.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </header>

          {/* ---- Content body ---- */}
          <div className="bg-white dark:bg-surface-900 px-6 lg:px-10 py-8 lg:py-10">

            {/* Background */}
            {hasBg && (
              <Reveal>
                <div id="background" className="mb-8">
                  <Label text="项目背景" />
                  <div className="prose-content"><StrapiBlocks content={background} /></div>
                </div>
              </Reveal>
            )}

            {/* Challenges */}
            {hasCh && (
              <Reveal delay={hasBg ? 60 : 0}>
                <div id="challenges" className="mb-8">
                  <Label text="挑战与目标" />
                  <div className="prose-content"><StrapiBlocks content={challenges} /></div>
                </div>
              </Reveal>
            )}

            {/* Solution content */}
            {hasCt && (
              <Reveal>
                <div id="solution" className="mb-8">
                  <Label text="解决方案" />
                  <div className="prose-content"><StrapiBlocks content={solution.content} /></div>
                </div>
              </Reveal>
            )}

            {/* Highlights */}
            {hasHi && (
              <Reveal>
                <div id="highlights" className="mb-8">
                  <Label text="方案亮点" />
                  <div className="prose-content"><StrapiBlocks content={highlights} /></div>
                </div>
              </Reveal>
            )}

            {/* Features */}
            {hasFeat && (
              <Reveal>
                <div id="features" className="mb-8">
                  <Label text="核心能力" />
                  <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
                    {featureList.map((f, i) => (
                      <Reveal key={i} delay={i * 40}>
                        <div className="group p-4 rounded-lg border border-surface-100 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-600 transition-colors h-full">
                          <div className="flex items-start gap-3">
                            {f.icon && (
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400 transition-colors">
                                <FeatureIcon name={f.icon} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-snug">{f.label}</h3>
                              {f.value && <p className="mt-1 text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{f.value}</p>}
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Cases */}
            {hasCases && (
              <Reveal>
                <div id="cases">
                  <Label text="典型案例" />
                  <div className="prose-content"><StrapiBlocks content={cases} /></div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <CtaSection
          title="需要类似的"
          highlightText="解决方案"
          description="联系我们，我们将根据您的需求提供定制化的解决方案"
          buttonText="联系我们"
          secondaryLink={{ href: "/solutions", text: "返回方案列表" }}
        />
      </div>
    </main>
  )
}
