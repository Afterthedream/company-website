'use client'

import { getStrapiMedia } from '@/lib/strapi'

function renderInlineChildren(children: any[]): React.ReactNode {
  if (!children?.length) return null
  return children.map((child: any, i: number) => {
    let node: React.ReactNode = child.text ?? ''
    if (child.bold)          node = <strong key={i}>{node}</strong>
    if (child.italic)        node = <em key={i}>{node}</em>
    if (child.underline)     node = <u key={i}>{node}</u>
    if (child.strikethrough) node = <s key={i}>{node}</s>
    if (child.code)          node = <code key={i}>{node}</code>
    if (child.type === 'link') {
      node = (
        <a key={i} href={child.url} target="_blank" rel="noreferrer">
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
      return <p key={i}>{renderInlineChildren(block.children)}</p>
    case 'heading': {
      const text = renderInlineChildren(block.children)
      if (block.level === 1) return <h2 key={i}>{text}</h2>
      if (block.level === 2) return <h3 key={i}>{text}</h3>
      if (block.level === 3) return <h4 key={i}>{text}</h4>
      return <h5 key={i}>{text}</h5>
    }
    case 'list':
      if (block.format === 'ordered') {
        return (
          <ol key={i}>
            {block.children?.map((item: any, j: number) => (
              <li key={j}>{renderInlineChildren(item.children)}</li>
            ))}
          </ol>
        )
      }
      return (
        <ul key={i}>
          {block.children?.map((item: any, j: number) => (
            <li key={j}>{renderInlineChildren(item.children)}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote key={i}>
          {renderInlineChildren(block.children)}
        </blockquote>
      )
    case 'code':
      return (
        <pre key={i}>
          <code>{renderInlineChildren(block.children)}</code>
        </pre>
      )
    case 'image':
      return block.image?.url ? (
        <img key={i} src={getStrapiMedia(block.image.url)} alt={block.image.alternativeText || ''} />
      ) : null
    case 'table': {
      const rows = block.children || []
      // Strapi v5 可能用 tableHead / tableBody 分组，也可能直接是 tableRow 数组
      const flatRows: any[] = []
      for (const child of rows) {
        if (child.type === 'tableHead' || child.type === 'tableBody') {
          flatRows.push(...(child.children || []))
        } else {
          flatRows.push(child)
        }
      }
      return (
        <table key={i}>
          <tbody>
            {flatRows.map((row: any, ri: number) => (
              <tr key={ri}>
                {row.children?.map((cell: any, ci: number) => {
                  const Tag = ri === 0 ? 'th' : 'td'
                  return <Tag key={ci}>{renderInlineChildren(cell.children)}</Tag>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    case 'tableRow':
      return (
        <tr key={i}>
          {block.children?.map((cell: any, j: number) => (
            <td key={j}>{renderInlineChildren(cell.children)}</td>
          ))}
        </tr>
      )
    case 'tableCell':
      return <td key={i}>{renderInlineChildren(block.children)}</td>
    default:
      if (block.children) {
        return <p key={i}>{renderInlineChildren(block.children)}</p>
      }
      return null
  }
}

/**
 * 检测字符串是否包含 HTML 标签
 */
function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str)
}

/**
 * 检测字符串是否包含 Markdown 语法
 */
function isMarkdown(str: string): boolean {
  return /^#{1,4}\s+/m.test(str) || /\*\*.+?\*\*/.test(str) || /^[\-\*]\s+/m.test(str) || /^\d+\.\s+/m.test(str) || /^>\s+/m.test(str) || /```/.test(str)
}

/**
 * 检测字符串是否是 JSON 数组/对象
 */
function tryParseJson(str: string): any | null {
  const trimmed = str.trim()
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try { return JSON.parse(trimmed) } catch { return null }
  }
  return null
}

/**
 * 处理行内 Markdown：**粗体**、*斜体*、`代码`、[链接](url)
 */
function renderInlineText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    const codeMatch = remaining.match(/`(.+?)`/)
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/)

    const matches = [
      boldMatch && { type: 'bold', match: boldMatch },
      codeMatch && { type: 'code', match: codeMatch },
      linkMatch && { type: 'link', match: linkMatch },
    ].filter(Boolean) as { type: string; match: RegExpMatchArray }[]

    if (matches.length === 0) {
      parts.push(remaining)
      break
    }

    matches.sort((a, b) => (a.match.index || 0) - (b.match.index || 0))
    const first = matches[0]
    const idx = first.match.index || 0

    if (idx > 0) parts.push(remaining.slice(0, idx))

    if (first.type === 'bold') {
      parts.push(<strong key={key++}>{first.match[1]}</strong>)
      remaining = remaining.slice(idx + first.match[0].length)
    } else if (first.type === 'code') {
      parts.push(<code key={key++}>{first.match[1]}</code>)
      remaining = remaining.slice(idx + first.match[0].length)
    } else if (first.type === 'link') {
      parts.push(<a key={key++} href={first.match[2]} target="_blank" rel="noreferrer">{first.match[1]}</a>)
      remaining = remaining.slice(idx + first.match[0].length)
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

/**
 * Markdown 字符串 → React 节点
 */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') { i++; continue }

    // 代码块 ```
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]); i++
      }
      i++
      elements.push(<pre key={elements.length}><code>{codeLines.join('\n')}</code></pre>)
      continue
    }

    // 标题
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const Tag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements
      elements.push(<Tag key={elements.length}>{renderInlineText(headingMatch[2])}</Tag>)
      i++; continue
    }

    // 无序列表
    if (/^[\-\*]\s+/.test(line)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^[\-\*]\s+/.test(lines[i])) {
        items.push(<li key={items.length}>{renderInlineText(lines[i].replace(/^[\-\*]\s+/, ''))}</li>); i++
      }
      elements.push(<ul key={elements.length}>{items}</ul>)
      continue
    }

    // 有序列表
    if (/^\d+\.\s+/.test(line)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(<li key={items.length}>{renderInlineText(lines[i].replace(/^\d+\.\s+/, ''))}</li>); i++
      }
      elements.push(<ol key={elements.length}>{items}</ol>)
      continue
    }

    // 引用
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={elements.length}>{renderInlineText(line.slice(2))}</blockquote>)
      i++; continue
    }

    // 水平线 --- / *** / ___
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      elements.push(<hr key={elements.length} />)
      i++; continue
    }

    // 普通段落
    elements.push(<p key={elements.length}>{renderInlineText(line)}</p>)
    i++
  }

  return <div className="prose-content">{elements}</div>
}

export default function StrapiBlocks({ content }: { content: any }) {
  if (!content) return null

  let parsed = content

  // JSON 字符串 → 解析
  if (typeof content === 'string') {
    const json = tryParseJson(content)
    if (json !== null) parsed = json
  }

  // Strapi blocks 数组
  if (Array.isArray(parsed)) {
    return (
      <div className="prose-content">
        {parsed.map((block: any, i: number) => renderBlock(block, i))}
      </div>
    )
  }

  // 单个 block 对象
  if (typeof parsed === 'object' && parsed !== null && parsed.type) {
    return (
      <div className="prose-content">
        {renderBlock(parsed, 0)}
      </div>
    )
  }

  // 字符串：HTML > Markdown > 纯文本
  if (typeof parsed === 'string') {
    if (isHtml(parsed)) {
      return (
        <div className="strapi-content" dangerouslySetInnerHTML={{ __html: parsed }} />
      )
    }
    if (isMarkdown(parsed)) {
      return renderMarkdown(parsed)
    }
    // 纯文本
    return (
      <div className="prose-content">
        {parsed.split('\n').filter(l => l.trim()).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    )
  }

  return null
}
