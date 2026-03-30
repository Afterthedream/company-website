'use client'

import { useState, useEffect, useRef } from 'react'

interface Company {
  id: number
  documentId: string
  name: string
  establishedYear?: string
  projectCount?: number
}

interface StatsBarProps {
  company?: Company | null
}

function CountUp({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function StatsBar({ company }: StatsBarProps) {
  const stats = [
    { label: '成立年份', value: company?.establishedYear ? parseInt(company.establishedYear) : 2005, suffix: '' },
    { label: '成功案例', value: company?.projectCount || 500, suffix: '+' },
    { label: '服务客户', value: 200, suffix: '+' },
    { label: '覆盖城市', value: 50, suffix: '+' },
  ]

  return (
    <section className="relative -mt-1 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 rounded-2xl shadow-2xl shadow-primary-900/30 py-8 px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center relative">
                {/* 分隔线（非最后一项） */}
                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/20" />
                )}
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-primary-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
