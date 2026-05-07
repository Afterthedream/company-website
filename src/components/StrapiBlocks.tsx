'use client'

import { Fragment } from 'react'
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
  return (
    /^#{1,4}\s+/m.test(str) ||
    /\*\*.+?\*\*/.test(str) ||
    /^[\-\*]\s+/m.test(str) ||
    /^\d+\.\s+/m.test(str) ||
    /^>\s+/m.test(str) ||
    /```/.test(str) ||
    /^\|.+\|$/m.test(str)
  )
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
 * 检测是否为分层架构图（含 ┌ └ ├ ─ 等 box-drawing 字符，且有 │ 分隔的层级）
 */
function isLayeredDiagram(text: string): boolean {
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 3) return false
  const hasBoxChars = /[┌└├┤┬┴┼─]/.test(text)
  const verticalBars = (text.match(/│/g) || []).length
  // 至少有 4 个 │（2 行内容），且有 box-drawing 边框字符
  return hasBoxChars && verticalBars >= 4
}

/**
 * 检测是否为步骤流（含 "→" 箭头的横向步骤）
 */
function isStepFlow(text: string): boolean {
  const lines = text.split('\n').filter(l => l.trim())
  // 至少有一行包含 → 且看起来像步骤
  const arrowLines = lines.filter(l => l.includes('→') || l.includes('->') || l.includes('==>'))
  if (arrowLines.length === 0) return false
  // 且包含步骤编号或关键词
  const hasSteps = /第[一二三四五六七八九十\d]步|步骤|Step\s*\d/i.test(text)
  return hasSteps && arrowLines.length >= 1
}

/**
 * 检测是否为双向通信流（含 ⟷ 或双向箭头）
 */
function isBidiFlow(text: string): boolean {
  return /⟷|⟷|◄.*━.*►|实时上传.*调度指令|调度指令.*实时上传/.test(text)
}

/**
 * 解析分层架构图为结构化数据
 * 支持两种格式：
 *   格式A: │ 标签 │ 内容 │   (同一行)
 *   格式B: │ 标签 │  +  │ 内容 │  (分两行，标签和内容各一行)
 */
function parseLayeredDiagram(text: string): { label: string; content: string }[] {
  const lines = text.split('\n')
  const layers: { label: string; content: string }[] = []

  // 先尝试格式A：同一行 │ 标签 │ 内容 │
  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(/^│\s*(.+?)\s{2,}│\s*(.+?)\s*│?\s*$/)
    if (match) {
      const label = match[1].replace(/\s+/g, '').trim()
      const content = match[2].trim()
      if (label && content && label.length < 10) {
        layers.push({ label, content })
      }
    }
  }

  // 如果格式A没匹配到，尝试格式B：每行只有一个 │...│，标签和内容交替出现
  if (layers.length === 0) {
    const contentLines: string[] = []
    for (const line of lines) {
      const trimmed = line.trim()
      // 匹配 │ 内容 │ 格式（只有两个 │）
      const match = trimmed.match(/^│\s*(.+?)\s*│$/)
      if (match) {
        contentLines.push(match[1].trim())
      }
    }

    // 跳过边框行（┌ ├ └ 开头的），把内容行两两配对为 label + content
    for (let j = 0; j < contentLines.length; j++) {
      const current = contentLines[j]
      // 跳过纯分隔线
      if (/^[─]+$/.test(current)) continue

      // 判断当前行是否是标签行（短，且含中文字层级关键词）
      const isLabel = current.length < 20 && /[层]/.test(current)
      if (isLabel && j + 1 < contentLines.length) {
        const label = current.replace(/\s+/g, '').trim()
        const content = contentLines[j + 1].trim()
        if (label && content) {
          layers.push({ label, content })
        }
        j++ // 跳过下一行
      }
    }
  }

  return layers
}


/**
 * 解析步骤流
 */
function parseStepFlow(text: string): { label: string; desc?: string }[] {
  const lines = text.split('\n').filter(l => l.trim())
  const steps: { label: string; desc?: string }[] = []

  for (const line of lines) {
    // 匹配含 → 的行，提取步骤
    if (line.includes('→') || line.includes('->')) {
      const parts = line.split(/→|->|==>/).map(p => p.trim()).filter(Boolean)
      for (const part of parts) {
        const clean = part.replace(/\s+/g, ' ').trim()
        if (clean) {
          // 尝试分离 "步骤名  描述"
          const descMatch = clean.match(/^(.+?)\s{2,}(.+)$/)
          if (descMatch) {
            steps.push({ label: descMatch[1].trim(), desc: descMatch[2].trim() })
          } else {
            steps.push({ label: clean })
          }
        }
      }
    }
  }
  return steps
}

/**
 * 渲染分层架构图为彩色表格
 */
function renderLayeredDiagram(text: string, key: number): React.ReactNode {
  const layers = parseLayeredDiagram(text)
  if (layers.length === 0) {
    return <pre key={key}><code>{text}</code></pre>
  }

  const colorSchemes = [
    { bg: '#dbeafe', badge: '#1d4ed8' },
    { bg: '#e0f2fe', badge: '#0284c7' },
    { bg: '#ecfdf5', badge: '#059669' },
    { bg: '#fef9c3', badge: '#d97706' },
    { bg: '#fce7f3', badge: '#db2777' },
    { bg: '#f3e8ff', badge: '#7c3aed' },
  ]

  // 检测内容是否包含 "·" 分隔的多个组件（说明是三列格式：标签 + 组件 + 定位）
  const isThreeCol = layers.some(l => l.content.includes('·'))

  // 三列格式：把 content 拆分为 "核心组件" 和 "定位"
  const parsed = layers.map(l => {
    if (isThreeCol && l.content.includes('·')) {
      // 尝试在最后一个 "·" 后面分离出定位描述
      const parts = l.content.split('·').map(p => p.trim())
      // 最后一部分如果很短且不像组件名，当作定位
      if (parts.length >= 2) {
        const last = parts[parts.length - 1]
        // 定位关键词
        const positionKeywords = ['落地', '支撑', '中枢', '传输', '采集', '管控', '管理', '服务']
        const isPosition = positionKeywords.some(k => last.includes(k))
        if (isPosition) {
          return {
            label: l.label,
            components: parts.slice(0, -1).join(' · '),
            position: last,
          }
        }
      }
      return { label: l.label, components: l.content, position: '' }
    }
    return { label: l.label, components: l.content, position: '' }
  })

  return (
    <div key={key} style={{ margin: '14px 0 28px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr>
            <th style={{ background: '#0c4a6e', color: '#fff', padding: '10px 14px', textAlign: 'left', width: '120px', border: 'none' }}>层级</th>
            <th style={{ background: '#0c4a6e', color: '#fff', padding: '10px 14px', textAlign: 'left', border: 'none' }}>核心组件</th>
            {isThreeCol && (
              <th style={{ background: '#0c4a6e', color: '#fff', padding: '10px 14px', textAlign: 'left', width: '160px', border: 'none' }}>定位</th>
            )}
          </tr>
        </thead>
        <tbody>
          {parsed.map((layer, li) => {
            const scheme = colorSchemes[li % colorSchemes.length]
            return (
              <tr key={li} style={{ background: scheme.bg }}>
                <td style={{ padding: '14px 16px', border: 'none', borderBottom: '2px solid #fff' }}>
                  <span style={{
                    display: 'inline-block', fontWeight: 700, fontSize: '14px',
                    padding: '4px 14px', borderRadius: '6px', letterSpacing: '2px',
                    color: '#fff', background: scheme.badge,
                  }}>
                    {layer.label}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', border: 'none', borderBottom: '2px solid #fff', color: '#334155' }}>
                  {layer.components}
                </td>
                {isThreeCol && (
                  <td style={{ padding: '14px 16px', border: 'none', borderBottom: '2px solid #fff', color: '#64748b', fontSize: '13px' }}>
                    {layer.position}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * 渲染步骤流为步骤卡片
 */
function renderStepFlow(steps: { label: string; desc?: string }[], key: number): React.ReactNode {
  if (steps.length === 0) return null
  return (
    <div key={key} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0', margin: '20px 0 28px', flexWrap: 'wrap',
    }}>
      {steps.map((step, si) => (
        <Fragment key={si}>
          <div style={{
            background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
            border: '1px solid #7dd3fc', borderRadius: '8px',
            padding: '12px 18px', textAlign: 'center', minWidth: '140px',
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0369a1' }}>
              {['①', '②', '③', '④', '⑤', '⑥'][si] || `${si + 1}`}
            </div>
            <div style={{ fontSize: '13px', color: '#0c4a6e', marginTop: '2px' }}>
              {step.label}
            </div>
            {step.desc && (
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                <small>{step.desc}</small>
              </div>
            )}
          </div>
          {si < steps.length - 1 && (
            <div style={{ fontSize: '20px', color: '#94a3b8', margin: '0 6px' }}>→</div>
          )}
        </Fragment>
      ))}
    </div>
  )
}

/**
 * 检测是否为通用流程图（含节点 → 节点模式）
 */
function isFlowDiagram(text: string): boolean {
  const lines = text.split('\n').filter(l => l.trim())
  // 包含 ──→ 或 ──→ 或 ──→ 箭头
  const hasArrows = /──+→|──+->|──+=>/.test(text)
  // 或包含 │ 和 ▼ 等流程指示符
  const hasFlowIndicators = /[│├└┌┐┘┤].*[▼▲◀▶]|[▼▲◀▶].*[│├└┌┐┘┤]/.test(text)
  return hasArrows || (hasFlowIndicators && lines.length >= 3)
}

/**
 * 解析流程图节点
 */
function parseFlowDiagram(text: string): { nodes: { name: string; desc?: string; icon?: string }[], arrows: string[] } {
  const lines = text.split('\n').filter(l => l.trim())
  const nodes: { name: string; desc?: string; icon?: string }[] = []
  const arrows: string[] = []

  // 图标映射
  const iconMap: Record<string, string> = {
    '污水厂': '🏭', '污泥厂': '♻️', '第三方地磅': '⚖️', '视频监控': '📹',
    'GIS': '🗺️', 'GPS': '🗺️', '指挥中心': '🏛️', '现场人员': '👷',
    '系统打通': '🔗', '数据治理': '🧹', '定标准搭平台': '📐', '扩应用': '🚀',
  }

  for (const line of lines) {
    const trimmed = line.trim()
    // 匹配 "节点 ──→ 节点" 模式
    const nodeMatches = trimmed.match(/([^\s─→<►▼▲]+(?:\s*[^\s─→<►▼▲]+)*)\s*──+→\s*([^\s─→<►▼▲]+(?:\s*[^\s─→<►▼▲]+)*)/g)
    if (nodeMatches) {
      for (const m of nodeMatches) {
        const parts = m.split(/──+→/).map(p => p.trim()).filter(Boolean)
        for (const part of parts) {
          if (!nodes.find(n => n.name === part)) {
            const icon = Object.entries(iconMap).find(([k]) => part.includes(k))?.[1]
            nodes.push({ name: part, icon })
          }
        }
      }
    }
    // 匹配独立的节点行（被 │ 包含或在特定位置）
    const nodeLine = trimmed.match(/^│?\s*(.+?)\s*│?\s*$/)
    if (nodeLine && !trimmed.includes('──') && !trimmed.includes('▼') && !trimmed.includes('┌') && !trimmed.includes('└')) {
      const name = nodeLine[1].trim()
      if (name && name.length > 1 && name.length < 20 && !nodes.find(n => n.name === name)) {
        const icon = Object.entries(iconMap).find(([k]) => name.includes(k))?.[1]
        if (icon) nodes.push({ name, icon })
      }
    }
  }
  return { nodes, arrows }
}

/**
 * 渲染流程图为节点流程
 */
function renderFlowDiagram(text: string, key: number): React.ReactNode {
  const { nodes } = parseFlowDiagram(text)

  if (nodes.length < 2) {
    // 回退到普通代码块
    return <pre key={key}><code>{text}</code></pre>
  }

  return (
    <div key={key} style={{
      background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
      padding: '28px 24px', margin: '16px 0 28px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexWrap: 'wrap', gap: '0',
      }}>
        {nodes.map((node, ni) => (
          <Fragment key={ni}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#fff', border: '2px solid #bae6fd', borderRadius: '10px',
              padding: '14px 20px', minWidth: '140px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              {node.icon && <span style={{ fontSize: '26px', flexShrink: 0 }}>{node.icon}</span>}
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#0c4a6e' }}>{node.name}</div>
                {node.desc && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{node.desc}</div>}
              </div>
            </div>
            {ni < nodes.length - 1 && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                margin: '0 6px', color: '#94a3b8',
              }}>
                <span style={{ fontSize: '22px', letterSpacing: '-2px' }}>━━━</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

/**
 * 渲染代码块：优先检测是否为特殊图表，否则渲染为 <pre>
 */
function renderCodeBlock(text: string, key: number): React.ReactNode {
  if (isLayeredDiagram(text)) return renderLayeredDiagram(text, key)
  if (isStepFlow(text)) return renderStepFlow(parseStepFlow(text), key)
  if (isFlowDiagram(text)) return renderFlowDiagram(text, key)
  return <pre key={key}><code>{text}</code></pre>
}

/* ================================================================== */
/*  Markdown Parser                                                    */
/* ================================================================== */

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

    // 代码块 ``` → 检测是否为特殊图表
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]); i++
      }
      i++
      const codeText = codeLines.join('\n')
      elements.push(renderCodeBlock(codeText, elements.length))
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

    // 表格
    if (/^\|.+\|$/.test(line.trim())) {
      const tableRows: string[][] = []
      while (i < lines.length && /^\|.+\|$/.test(lines[i].trim())) {
        const row = lines[i].trim()
          .replace(/^\|/, '').replace(/\|$/, '')
          .split('|').map(cell => cell.trim())
        if (!row.every(cell => /^[-:]+$/.test(cell))) {
          tableRows.push(row)
        }
        i++
      }
      if (tableRows.length > 0) {
        elements.push(
          <table key={elements.length}>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => {
                    const Tag = ri === 0 ? 'th' : 'td'
                    return <Tag key={ci}>{renderInlineText(cell)}</Tag>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
      continue
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

    // 普通段落 — 但先检测是否为连续的 ASCII art 行（无代码块包裹的情况）
    // 收集连续的 "图表特征" 行
    if (/[┌└├┤┬┴┼─│▼▲◀▶►◄━]/.test(line)) {
      const artLines: string[] = [line]
      i++
      while (i < lines.length && /[┌└├┤┬┴┼─│▼▲◀▶►◄━→]/.test(lines[i]) && lines[i].trim() !== '') {
        artLines.push(lines[i]); i++
      }
      const artText = artLines.join('\n')
      elements.push(renderCodeBlock(artText, elements.length))
      continue
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
