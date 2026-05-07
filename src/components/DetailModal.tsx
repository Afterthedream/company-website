'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getStrapiMedia } from '@/lib/strapi'
import { parseRichText, parseFeatures } from '@/lib/richTextParser'
import StrapiBlocks from '@/components/StrapiBlocks'

export interface ModalItem {
  title?: string
  name?: string
  description?: string | null
  excerpt?: string | null
  content?: any
  features?: any
  specifications?: any
  cases?: string | null
  coverImage?: any
  image?: any
  category?: string
  publishedAt?: string
  date?: string
}

interface DetailModalProps {
  item: ModalItem | null
  onClose: () => void
  type: 'product' | 'solution' | 'news' | 'case'
}


export default function DetailModal({ item, onClose, type }: DetailModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 焦点陷阱 + Escape 关闭
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement

    // 打开时自动聚焦关闭按钮
    closeButtonRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const modal = modalRef.current
      if (!modal) return
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      previouslyFocused?.focus()
    }
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!isMounted || !item) return null

  const title = parseRichText(item.name || item.title || '') || (item.name || item.title || '')
  const excerpt = parseRichText(item.description || item.excerpt || '') || ''

  // 封面图
  const coverImg = (() => {
    const cover = item.coverImage || item.image
    if (!cover) return null
    const url = Array.isArray(cover) ? cover[0]?.url : cover?.url
    return getStrapiMedia(url ?? null)
  })()

  // features
  const featureList = parseFeatures(item.features)
  const specificationList = parseFeatures(item.specifications)

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`relative bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-4xl md:max-w-6xl overflow-hidden animate-scale-in ${type === 'news' ? 'h-[85vh]' : 'h-[90vh]'} md:h-auto md:max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* 关闭按钮 */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm hover:bg-surface-50 dark:hover:bg-surface-700 shadow-lg transition-all duration-200"
          aria-label="关闭"
        >
          <svg className="w-5 h-5 text-surface-600 dark:text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* 左侧：图片 - 移动端限制高度，桌面端自适应 */}
          <div className={`bg-surface-50 dark:bg-surface-800/50 flex items-center justify-center overflow-hidden flex-shrink-0 ${
            type === 'news' ? 'md:w-1/2 max-h-[40vh] md:max-h-none' : 'md:w-2/5 max-h-[35vh] md:max-h-none'
          }`}>
            {coverImg ? (
              <img
                src={coverImg}
                alt={title}
                loading="lazy"
                className={`w-full h-full transition-transform duration-300 hover:scale-[1.02] ${type === 'news' ? 'object-contain p-4' : 'object-contain p-6 md:p-8'}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-surface-300 dark:text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* 右侧：内容 - 使用flex布局确保关闭按钮可见 */}
          <div className={`flex flex-col overflow-hidden ${type === 'news' ? 'md:w-1/2' : 'md:w-3/5'}`}>
            {/* 可滚动内容区 - iOS兼容 */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-6 space-y-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
            {/* 类型标签 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {type === 'news' && item.category && (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    item.category === 'company'
                      ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-700'
                      : 'bg-accent-50 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400 border border-accent-100 dark:border-accent-700'
                  }`}>
                    {item.category === 'company' ? '公司新闻' : '行业资讯'}
                  </span>
                )}
                {type !== 'news' && type !== 'product' && type !== 'solution' && type !== 'case' && (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    type === 'product'
                      ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-700'
                      : 'bg-accent-50 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400 border border-accent-100 dark:border-accent-700'
                  }`}>
                    {type === 'product' ? '产品' : '解决方案'}
                  </span>
                )}
                {(item.publishedAt || item.date) && type !== 'product' && type !== 'solution' && type !== 'case' && (
                  <span className="text-surface-500 dark:text-surface-400 text-sm">
                    {new Date(item.publishedAt || item.date!).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>
            </div>

            {/* 标题 */}
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 leading-tight">{title}</h2>

            {/* 新闻：摘要 + 正文 */}
            {type === 'news' && (
              <>
                {excerpt && (
                  <div className={`p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800/50`}>
                    <p className="text-surface-600 dark:text-surface-300 italic leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                )}
                {item.content && (
                  <div className="border-t border-surface-200 dark:border-surface-700 pt-6 space-y-4">
                    <StrapiBlocks content={item.content} />
                  </div>
                )}
              </>
            )}

            {/* 产品简介 */}
            {type !== 'news' && excerpt && (
              <div className="border-t border-surface-200 dark:border-surface-700 pt-6">
                <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-3">产品简介</h3>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed text-base">{excerpt}</p>
              </div>
            )}

            {/* 功能特点 */}
            {featureList.length > 0 && (
              <div className={`p-5 rounded-xl ${
                type === 'product'
                  ? 'bg-primary-50/50 dark:bg-primary-900/30 border border-primary-100/50 dark:border-primary-800/50'
                  : 'bg-accent-50/50 dark:bg-accent-900/30 border border-accent-100/50 dark:border-accent-800/50'
              }`}>
                <h3 className={`text-base font-semibold mb-4 ${
                  type === 'product' ? 'text-primary-700 dark:text-primary-300' : 'text-accent-700 dark:text-accent-300'
                }`}>
                  功能特点
                </h3>
                <div className="space-y-3">
                  {featureList.map((f, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                        type === 'product' ? 'bg-primary-500 dark:bg-primary-400' : 'bg-accent-500 dark:bg-accent-400'
                      }`} />
                      <div className="text-sm">
                        {f.value ? (
                          <>
                            <span className="font-medium text-surface-800 dark:text-surface-100">{f.label}：</span>
                            <span className="text-surface-600 dark:text-surface-300">{f.value}</span>
                          </>
                        ) : (
                          <span className="text-surface-700 dark:text-surface-200">{f.label}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 技术参数 */}
            {specificationList.length > 0 && (
              <div className="bg-surface-50/50 dark:bg-surface-800/60 rounded-xl p-5 border border-surface-200/50 dark:border-surface-700/50">
                <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">技术参数</h3>
                <div className="space-y-3">
                  {specificationList.map((spec, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-surface-400 dark:bg-surface-500 flex-shrink-0 mt-1.5" />
                      <div className="text-sm">
                        {spec.value ? (
                          <>
                            <span className="font-medium text-surface-800 dark:text-surface-100">{spec.label}：</span>
                            <span className="text-surface-600 dark:text-surface-300">{spec.value}</span>
                          </>
                        ) : (
                          <span className="text-surface-700 dark:text-surface-200">{spec.label}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cases */}
            {type === 'solution' && item.cases && (
              <div className="bg-accent-50 dark:bg-accent-900/20 rounded-xl p-5 border border-accent-100 dark:border-accent-800/30">
                <h3 className="text-sm font-semibold text-accent-700 dark:text-accent-400 mb-2">典型案例</h3>
                <p className="text-accent-700 dark:text-accent-300 text-sm leading-relaxed">{parseRichText(item.cases) || String(item.cases)}</p>
              </div>
            )}
            </div>

            {/* 关闭按钮 - 固定在底部 */}
            <div className="flex-shrink-0 p-6 pt-0">
              <button
                onClick={onClose}
                className={`w-full py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
                  type === 'solution' ? 'bg-accent-600' : 'bg-primary-600'
                }`}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
