import { getSolutionBySlug } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'
import SolutionDetailClient from './SolutionDetailClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const solution = await getSolutionBySlug(slug)
  if (!solution) return { title: '方案未找到 - 四川沧杰荇科技有限公司' }
  return {
    title: `${solution.title} - 解决方案 - 四川沧杰荇科技有限公司`,
    description: parseRichText(solution.description).slice(0, 160) || '专业解决方案',
  }
}

export default function SolutionPage() {
  return <SolutionDetailClient />
}
