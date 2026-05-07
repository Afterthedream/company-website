/**
 * 解析 Strapi Rich Text 字段
 * Strapi v5 的 Rich Text 返回的是对象数组，需要转换为纯文本
 */

interface RichTextNode {
  type: string;
  children?: Array<{
    type: string;
    text: string;
  }>;
  text?: string;
}

/**
 * 将 Rich Text 对象数组转换为纯文本
 */
export function parseRichText(richText: any): string {
  if (!richText) return '';

  // 如果是字符串，尝试解析 JSON 或直接返回
  if (typeof richText === 'string') {
    const trimmed = richText.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed !== 'string') return parseRichText(parsed);
      } catch { /* 不是 JSON，当纯文本返回 */ }
    }
    return richText;
  }

  // 如果是数组，遍历处理每个节点
  if (Array.isArray(richText)) {
    return richText
      .map((node: RichTextNode) => {
        if (node.text) {
          return node.text;
        }
        if (node.children && Array.isArray(node.children)) {
          return node.children.map((child) => child.text || '').join('');
        }
        return '';
      })
      .join('');
  }

  // 如果是对象，尝试提取文本
  if (typeof richText === 'object') {
    return parseRichText([richText]);
  }

  return '';
}

/**
 * 安全地渲染文本内容（处理 Rich Text、字符串、数组等）
 */
export function renderTextContent(content: any): string {
  if (!content) return '';
  return parseRichText(content);
}

/**
 * 将任意 features 格式解析为 { label, value? }[] 列表
 */
export function parseFeatures(features: any): { label: string; value?: string; icon?: string }[] {
  if (!features) return []

  // 如果是 JSON 字符串，先解析
  if (typeof features === 'string') {
    const trimmed = features.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed !== 'string') return parseFeatures(parsed);
      } catch { /* 不是 JSON，走后面的逗号分割逻辑 */ }
    }
    return features.split(',').map((f: string) => ({ label: f.trim() }))
  }

  // 字符串数组 ["特性1", "特性2"] 或 对象数组 [{label: "xxx", value: "xxx"}]
  if (Array.isArray(features)) {
    const result: { label: string; value?: string; icon?: string }[] = []
    for (const f of features) {
      // {label, value} 格式
      if (typeof f === 'object' && f !== null && f.label) {
        result.push({
          label: String(f.label),
          value: f.value ? String(f.value) : undefined,
          icon: f.icon ? String(f.icon) : undefined,
        })
        continue
      }
      // 字符串
      if (typeof f === 'string') {
        const parts = f.split(/[:：]/)
        if (parts.length >= 2) {
          result.push({ label: parts[0].trim(), value: parts.slice(1).join(':').trim() })
        } else {
          result.push({ label: f })
        }
        continue
      }
      // {name/title, desc/value, icon} 格式
      if (typeof f === 'object' && f !== null && (f.name || f.title)) {
        result.push({
          label: String(f.name || f.title),
          value: f.desc || f.value ? String(f.desc || f.value) : undefined,
          icon: f.icon ? String(f.icon) : undefined,
        })
        continue
      }
      // {items: [...]} 嵌套格式（如 Strapi 组件）
      if (typeof f === 'object' && f !== null && Array.isArray(f.items)) {
        for (const item of f.items) {
          if (typeof item === 'string') {
            result.push({ label: item })
          } else if (typeof item === 'object' && item !== null) {
            const lbl = item.name || item.title || item.label
            const val = item.desc || item.value
            const ic = item.icon
            if (lbl) {
              result.push({ label: String(lbl), value: val ? String(val) : undefined, icon: ic ? String(ic) : undefined })
            }
          }
        }
        continue
      }
      // Strapi 富文本块
      if (typeof f === 'object' && f !== null && f.type && f.children) {
        result.push({ label: parseRichText([f]) })
        continue
      }
      // 其他对象：尝试提取 key-value
      if (typeof f === 'object' && f !== null) {
        for (const [key, val] of Object.entries(f)) {
          if (typeof val === 'string') {
            result.push({ label: key, value: val })
          }
        }
        continue
      }
      result.push({ label: String(f) })
    }
    return result
  }

  if (typeof features === 'object') {
    const result: { label: string; value?: string }[] = []
    for (const [key, val] of Object.entries(features)) {
      if (typeof val === 'string') {
        // 扁平对象 {"特性名": "特性值"}
        result.push({ label: key, value: val })
      } else if (typeof val === 'object' && val !== null) {
        // 嵌套对象 {"分组名": {"子项1": "值1", "子项2": "值2"}}
        for (const [subLabel, subVal] of Object.entries(val)) {
          result.push({
            label: `${key} - ${subLabel}`,
            value: String(subVal)
          })
        }
      }
    }
    return result
  }

  return []
}
