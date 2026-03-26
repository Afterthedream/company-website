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
  
  // 如果已经是字符串，直接返回
  if (typeof richText === 'string') return richText;
  
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
