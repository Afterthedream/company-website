'use client'

import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface CtaSectionProps {
  title?: string
  description?: string
  highlightText?: string
  buttonText?: string
  secondaryLink?: { href: string; text: string }
}

export default function CtaSection({ 
  title = "需要专业的",
  description = "我们的专业团队将根据您的具体需求，提供个性化的定制化解决方案",
  highlightText = "水治理方案",
  buttonText = "联系我们",
  secondaryLink = { href: "/products", text: "浏览产品" }
}: CtaSectionProps) {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.2)

  return (
    <section ref={sectionRef} className="py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`relative rounded-3xl bg-surface-900 overflow-hidden px-8 py-16 md:px-16 md:py-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left space-y-4 max-w-lg">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight whitespace-nowrap">
                {title}<span className="text-primary-300">{highlightText}</span>？
              </h2>
              <p className="text-base text-surface-100 leading-relaxed">
                {description}
              </p>
            </div>

            {/* 右 */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 bg-white text-surface-900 font-bold text-base py-4 px-10 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-black/10 active:scale-[0.97]"
              >
                {buttonText}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {secondaryLink && (
                <Link
                  href={secondaryLink.href}
                  className="group/link inline-flex items-center gap-1.5 text-base text-surface-200 hover:text-white transition-colors font-semibold"
                >
                  {secondaryLink.text}
                  <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
