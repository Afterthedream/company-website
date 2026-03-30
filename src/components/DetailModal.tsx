'use client'

import { useEffect } from 'react'
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
  type: 'product' | 'solution' | 'news'
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
    if (child.code)          node = <code key={i} className="bg-gray-100 px-1 rounded text-sm font-mono">{node}</code>
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
        <p key={i} className="text-gray-700 leading-relaxed">
          {renderInlineChildren(block.children)}
        </p>
      )
    case 'heading': {
      const text = renderInlineChildren(block.children)
      const cls = 'font-bold text-gray-900'
      if (block.level === 1) return <h1 key={i} className={`text-2xl ${cls}`}>{text}</h1>
      if (block.level === 2) return <h2 key={i} className={`text-xl ${cls}`}>{text}</h2>
      if (block.level === 3) return <h3 key={i} className={`text-lg ${cls}`}>{text}</h3>
      return <h4 key={i} className={`text-base ${cls}`}>{text}</h4>
    }
    case 'list':
      if (block.format === 'ordered') {
        return (
          <ol key={i} className="list-decimal list-inside space-y-1 text-gray-700">
            {block.children?.map((item: any, j: number) => (
              <li key={j}>{renderInlineChildren(item.children)}</li>
            ))}
          </ol>
        )
      }
      return (
        <ul key={i} className="list-disc list-inside space-y-1 text-gray-700">
          {block.children?.map((item: any, j: number) => (
            <li key={j}>{renderInlineChildren(item.children)}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote key={i} className="border-l-4 border-primary-400 pl-4 italic text-gray-600">
          {renderInlineChildren(block.children)}
        </blockquote>
      )
    case 'code':
      return (
        <pre key={i} className="bg-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-800">
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
              <p key={i} className="text-gray-700 leading-relaxed whitespace-pre-line">
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
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!item) return null

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="关闭"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 封面图 */}
        {coverImg ? (
          <div className="w-full overflow-hidden rounded-t-3xl bg-white">
            <img src={coverImg} alt={title} className="w-full h-auto max-h-[400px] object-contain mx-auto" />
          </div>
        ) : (
          <div className="w-full h-[200px] rounded-t-3xl bg-gray-50 flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* 新闻标签行 */}
          {type === 'news' && (
            <div className="flex items-center space-x-3">
              {item.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.category === 'company'
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {item.category === 'company' ? '公司新闻' : '行业资讯'}
                </span>
              )}
              {(item.publishedAt || item.date) && (
                <span className="text-gray-400 text-sm">
                  {new Date(item.publishedAt || item.date!).toLocaleDateString('zh-CN')}
                </span>
              )}
            </div>
          )}

          {/* 标题 */}
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">{title}</h2>

          {/* 新闻：摘要 + 正文 */}
          {type === 'news' && (
            <>
              {excerpt && (
                <p className="text-gray-500 italic border-l-4 border-primary-200 pl-3 leading-relaxed">
                  {excerpt}
                </p>
              )}
              {item.content && (
                <div className="border-t pt-4">
                  <StrapiBlocks content={item.content} />
                </div>
              )}
            </>
          )}

          {/* 产品 / 解决方案：描述 */}
          {type !== 'news' && excerpt && (
            <p className="text-gray-600 leading-relaxed">{excerpt}</p>
          )}

          {/* Features */}
          {featureList.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                {type === 'product' ? '产品特性' : '方案特点'}
              </h3>
              <div className="space-y-2">
                {featureList.map((f, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                    <div className="text-sm">
                      {f.value ? (
                        <>
                          <span className="font-medium text-gray-800">{f.label}：</span>
                          <span className="text-gray-600">{f.value}</span>
                        </>
                      ) : (
                        <span className="text-gray-700">{f.label}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cases */}
          {type === 'solution' && item.cases && (
            <div className="bg-primary-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-primary-700 mb-1">典型案例</h3>
              <p className="text-primary-700 text-sm">{parseRichText(item.cases) || String(item.cases)}</p>
            </div>
          )}

          {/* 关闭按钮 */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
