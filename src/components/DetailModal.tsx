'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
import { getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

export interface ModalItem {
  title?: string
  name?: string
  description?: string | null
  excerpt?: string | null
  content?: any
  features?: any
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

// 将任意 features 格式解析为 { label, value? }[] 列表
function parseFeatures(features: any): { label: string; value?: string }[] {
  if (!features) return []

  // 字符串数组 ["特性1", "特性2"]
  if (Array.isArray(features)) {
    return features.map((f: any) => ({ label: parseRichText(f) || String(f) }))
  }

  if (typeof features === 'object') {
    const result: { label: string; value?: string }[] = []
    for (const [key, val] of Object.entries(features)) {
      if (typeof val === 'string') {
        // 扁平对象 {"特性名": "特性值"}
        result.push({ label: key, value: val })
      } else if (typeof val === 'object' && val !== null) {
        // 嵌套对象 {"分组名": {"特性名": "特性值"}}，忽略分组名，展开子项
        for (const [subLabel, subVal] of Object.entries(val)) {
          result.push({ label: subLabel, value: String(subVal) })
        }
      }
    }
    return result
  }

  if (typeof features === 'string') {
    return features.split(',').map((f: string) => ({ label: f.trim() }))
  }

  return []
}
function renderInlineChildren(children: any[]): React.ReactNode {
  if (!children?.length) return null
  return children.map((child: any, i: number) => {
    let node: React.ReactNode = child.text ?? ''
    if (child.bold)          node = <strong key={i}>{node}</strong>
    if (child.italic)        node = <em key={i}>{node}</em>
    if (child.underline)     node = <u key={i}>{node}</u>
    if (child.strikethrough) node = <s key={i}>{node}</s>
    if (child.code)          node = <code key={i} className="bg-surface-100 px-1 rounded text-sm font-mono">{node}</code>
    if (child.type === 'link') {
      node = (
        <a key={i} href={child.url} target="_blank" rel="noreferrer"
          className="text-primary-600 underline hover:text-primary-700">
          {renderInlineChildren(child.children)}
        </a>
      )
    }
    return <span key={i}>{node}</span>
  })
}

function renderBlock(block: any, i: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={i} className="text-surface-700 leading-relaxed">
          {renderInlineChildren(block.children)}
        </p>
      )
    case 'heading': {
      const text = renderInlineChildren(block.children)
      const cls = 'font-bold text-surface-900'
      if (block.level === 1) return <h2 key={i} className={`text-2xl ${cls}`}>{text}</h2>
      if (block.level === 2) return <h3 key={i} className={`text-xl ${cls}`}>{text}</h3>
      if (block.level === 3) return <h4 key={i} className={`text-lg ${cls}`}>{text}</h4>
      return <h5 key={i} className={`text-base ${cls}`}>{text}</h5>
    }
    case 'list':
      if (block.format === 'ordered') {
        return (
          <ol key={i} className="list-decimal list-inside space-y-1 text-surface-700">
            {block.children?.map((item: any, j: number) => (
              <li key={j}>{renderInlineChildren(item.children)}</li>
            ))}
          </ol>
        )
      }
      return (
        <ul key={i} className="list-disc list-inside space-y-1 text-surface-700">
          {block.children?.map((item: any, j: number) => (
            <li key={j}>{renderInlineChildren(item.children)}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote key={i} className="border-l-4 border-primary-400 pl-4 italic text-surface-600">
          {renderInlineChildren(block.children)}
        </blockquote>
      )
    case 'code':
      return (
        <pre key={i} className="bg-surface-100 rounded-lg p-4 overflow-x-auto text-sm font-mono text-surface-800">
          {renderInlineChildren(block.children)}
        </pre>
      )
    case 'image':
      return block.image?.url ? (
        <img key={i} src={getStrapiMedia(block.image.url)} alt={block.image.alternativeText || ''}
          className="w-full rounded-lg object-cover" />
      ) : null
    default:
      return null
  }
}

function StrapiBlocks({ content }: { content: any }) {
  if (!content) return null
  // 已经是纯字符串（默认数据或 Markdown）
  if (typeof content === 'string') {
    // 处理 Markdown 图片语法 ![alt](url)
    const parts = content.split(/(!\[.*?\]\(.*?\))/g)
    return (
      <div className="space-y-3">
        {parts.map((part: string, i: number) => {
          // 检查是否是 Markdown 图片
          const imgMatch = part.match(/!\[(.*?)\]\((.*?)\)/)
          if (imgMatch) {
            const [, alt, src] = imgMatch
            const imgUrl = src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_STRAPI_URL}${src}`
            return (
              <img
                key={i}
                src={imgUrl}
                alt={alt}
                className="w-full rounded-lg object-cover"
              />
            )
          }
          // 普通文本段落
          if (part.trim()) {
            return (
              <p key={i} className="text-surface-700 leading-relaxed whitespace-pre-line">
                {part}
              </p>
            )
          }
          return null
        })}
      </div>
    )
  }
  // Strapi blocks 数组
  if (Array.isArray(content)) {
    return (
      <div className="space-y-3">
        {content.map((block: any, i: number) => renderBlock(block, i))}
      </div>
    )
  }
  return null
}
// ────────────────────────────────────────────────────────────────────────────

export default function DetailModal({ item, onClose, type }: DetailModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)

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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl md:max-w-6xl overflow-hidden animate-scale-in ${type === 'news' ? 'max-h-[85vh]' : 'max-h-[90vh]'}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* 关闭按钮 */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-200"
          aria-label="关闭"
        >
          <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* 左侧：图片 */}
          <div className={`bg-surface-50 flex items-center justify-center overflow-hidden ${type === 'news' ? 'md:w-1/2' : 'md:w-2/5'}`}>
            {coverImg ? (
              <img
                src={coverImg}
                alt={title}
                loading="lazy"
                className={`w-full h-full transition-transform duration-300 hover:scale-[1.02] ${type === 'news' ? 'object-contain' : 'object-contain p-8'}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* 右侧：内容 */}
          <div className={`flex flex-col overflow-hidden ${type === 'news' ? 'md:w-1/2' : 'md:w-3/5'}`}>
            {/* 可滚动内容区 */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-6 space-y-4" style={{ maxHeight: type === 'news' ? 'calc(85vh - 5rem)' : 'calc(90vh - 5rem)' }}>
            {/* 类型标签 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {type === 'news' && item.category && (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    item.category === 'company'
                      ? 'bg-primary-50 text-primary-600 border border-primary-100'
                      : 'bg-accent-50 text-accent-600 border border-accent-100'
                  }`}>
                    {item.category === 'company' ? '公司新闻' : '行业资讯'}
                  </span>
                )}
                {type !== 'news' && (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    type === 'product'
                      ? 'bg-primary-50 text-primary-600 border border-primary-100'
                      : 'bg-accent-50 text-accent-600 border border-accent-100'
                  }`}>
                    {type === 'product' ? '产品' : '解决方案'}
                  </span>
                )}
                {(item.publishedAt || item.date) && (
                  <span className="text-surface-500 text-sm">
                    {new Date(item.publishedAt || item.date!).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>
            </div>

            {/* 标题 */}
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 leading-tight">{title}</h2>

            {/* 新闻：摘要 + 正文 */}
            {type === 'news' && (
              <>
                {excerpt && (
                  <div className={`p-4 rounded-xl bg-primary-50 border border-primary-100`}>
                    <p className="text-surface-600 italic leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                )}
                {item.content && (
                  <div className="border-t border-surface-200 pt-6 space-y-4">
                    <StrapiBlocks content={item.content} />
                  </div>
                )}
              </>
            )}

            {/* 产品 / 解决方案：描述 */}
            {type !== 'news' && excerpt && (
              <p className="text-surface-600 leading-relaxed text-base">{excerpt}</p>
            )}

            {/* Features */}
            {featureList.length > 0 && (
              <div className={`p-5 rounded-xl ${
                type === 'product'
                  ? 'bg-primary-50/50 border border-primary-100/50'
                  : 'bg-accent-50/50 border border-accent-100/50'
              }`}>
                <h3 className={`text-base font-semibold mb-4 ${
                  type === 'product' ? 'text-primary-700' : 'text-accent-700'
                }`}>
                  {type === 'product' ? '产品特性' : '方案特点'}
                </h3>
                <div className="space-y-3">
                  {featureList.map((f, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                        type === 'product' ? 'bg-primary-500' : 'bg-accent-500'
                      }`} />
                      <div className="text-sm">
                        {f.value ? (
                          <>
                            <span className="font-medium text-surface-800">{f.label}：</span>
                            <span className="text-surface-600">{f.value}</span>
                          </>
                        ) : (
                          <span className="text-surface-700">{f.label}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cases */}
            {type === 'solution' && item.cases && (
              <div className="bg-accent-50 rounded-xl p-5 border border-accent-100">
                <h3 className="text-sm font-semibold text-accent-700 mb-2">典型案例</h3>
                <p className="text-accent-700 text-sm leading-relaxed">{parseRichText(item.cases) || String(item.cases)}</p>
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
