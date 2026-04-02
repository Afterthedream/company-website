'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import DetailModal from '@/components/DetailModal'
import CtaSection from '@/components/CtaSection'
import { CaseListSkeleton } from '@/components/Skeleton'
import { getStrapiMedia, getCases } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

interface CaseItem {
  id: number
  title: string
  client: string
  industry: string
  description: string
  results: string
  date: string
  coverImage: any
  content: any
}

const defaultCases = [
  {
    id: 1,
    title: '某市黑臭水体综合治理项目',
    client: '某市水务局',
    industry: '城市水环境',
    description: '针对城区 12 条黑臭河道，采用"截污纳管 + 生态修复 + 智慧监管"三位一体治理方案，历时 18 个月完成治理，水质从劣Ⅴ类提升至Ⅳ类。',
    results: '治理河道 36 公里，消除黑臭水体 12 处，受益人口 80 万',
    date: '2025-08-15',
  },
  {
    id: 2,
    title: '某工业园区废水零排放项目',
    client: '某化工集团',
    industry: '工业废水',
    description: '为化工园区设计零排放处理系统，集成膜浓缩、蒸发结晶等先进技术，实现废水 100% 回用，年节约用水 200 万吨。',
    results: '废水回用率 100%，年节水 200 万吨，减排 COD 500 吨',
    date: '2025-06-20',
  },
  {
    id: 3,
    title: '某县农村污水连片治理项目',
    client: '某县生态环境局',
    industry: '农村污水',
    description: '覆盖 15 个行政村、2.3 万户农户的分散式污水处理项目，采用"一体化设备 + 人工湿地"组合工艺，出水稳定达到一级 A 标准。',
    results: '覆盖 15 个村庄，日处理能力 5000 吨，受益农户 2.3 万户',
    date: '2025-04-10',
  },
  {
    id: 4,
    title: '某水厂提标改造工程',
    client: '某市自来水公司',
    industry: '饮用水安全',
    description: '对日供水 20 万吨的自来水厂进行提标改造，新增臭氧-活性炭深度处理工艺，出厂水达到直饮标准。',
    results: '供水能力提升至 25 万吨/日，水质达标率 100%',
    date: '2025-02-28',
  },
  {
    id: 5,
    title: '某市智慧水务综合管理平台',
    client: '某市水利局',
    industry: '智慧水务',
    description: '建设覆盖全市的智慧水务平台，整合 200+ 监测站点数据，实现水源、水厂、管网全流程智能化管控。',
    results: '接入监测站点 200+ 个，漏损率降低 15%，应急响应提速 60%',
    date: '2024-12-15',
  },
  {
    id: 6,
    title: '某河流域生态修复项目',
    client: '某市生态环境局',
    industry: '生态修复',
    description: '对受损河岸带进行系统性生态修复，重建滨水湿地 50 公顷，恢复生物多样性，打造城市生态廊道。',
    results: '修复河岸 18 公里，新建湿地 50 公顷，鸟类种类增加 30%',
    date: '2024-10-20',
  },
]

const accentThemes = [
  { tag: 'bg-primary-50 text-primary-700 border-primary-100', dot: 'bg-primary-400' },
  { tag: 'bg-accent-50 text-accent-600 border-accent-100', dot: 'bg-accent-400' },
  { tag: 'bg-warm-50 text-warm-500 border-warm-100', dot: 'bg-warm-400' },
]

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([])
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // 数据获取
  React.useEffect(() => {
    async function fetchCases() {
      try {
        const data = await getCases()
        setCases(data)
      } catch (error) {
        console.error('Error fetching cases:', error)
        setCases([])
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  const hasCases = cases.length > 0
  const displayCases = cases.map((item: any) => ({
    id: item.id,
    title: item.title,
    client: item.client,
    industry: (item.category && item.category !== 'river') ? item.category : '其他',
    description: item.description,
    results: item.results || '',
    date: item.projectDate,
    coverImage: item.cover,
    location: item.location
  }))

  const handleOpenModal = (caseItem: CaseItem) => {
    setSelectedCase(caseItem)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCase(null)
  }

  return (
    <main className="min-h-screen animate-page-enter">
      <Header />

      <PageHeader
        number="04"
        label="应用案例"
        title="成功案例展示"
        description="真实项目，看得见的效果——每一个案例都是专业实力的见证"
      />

      {/* 案例列表 */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <CaseListSkeleton count={3} />
          ) : !hasCases ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">暂时还没有案例哦</h3>
              <p className="text-sm text-surface-400">敬请期待后续更新~</p>
            </div>
          ) : (
          <div className="space-y-0">
            {displayCases.map((item: any, index: number) => {
              const theme = accentThemes[index % 3]
              const coverImg = item.coverImage ? getStrapiMedia(
                item.coverImage.data?.attributes?.url || 
                (Array.isArray(item.coverImage.data) && item.coverImage.data.length > 0) ? item.coverImage.data[0]?.attributes?.url : 
                item.coverImage.url
              ) : null

              return (
                <div key={item.id || index} className="group">
                  {/* 顶部分隔线 */}
                  <div className="border-t border-surface-100" />

                  <div className="relative py-12 md:py-16 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                    {/* 左侧：编号 + 图片 */}
                    <div className="flex-shrink-0 lg:w-[340px] space-y-4">
                      <span className="font-display text-7xl font-extrabold text-surface-100 group-hover:text-primary-200 transition-colors duration-300 leading-none select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* 图片区域 */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-50 border border-surface-100">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400">
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs text-surface-400 font-medium">待上传图片</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 右侧：内容 */}
                    <div className="flex-1 space-y-5 lg:pt-4">
                      {/* 日期 */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-surface-400">
                          {new Date(item.date).toLocaleDateString('zh-CN')}
                        </span>
                      </div>

                      {/* 标题 */}
                      <h2 className="text-2xl md:text-3xl font-bold text-surface-900 group-hover:text-surface-700 transition-colors duration-200">
                        {item.title}
                      </h2>

                      {/* 客户 */}
                      <p className="text-sm text-surface-500">
                        客户：<span className="font-medium text-surface-700">{item.client}</span>
                      </p>

                      {/* 描述 */}
                      <p className="text-base text-surface-500 leading-relaxed max-w-2xl">
                        {parseRichText(item.description) || item.description}
                      </p>

                      {/* 成果 */}
                      {item.results && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 border border-surface-100">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">项目成果</span>
                            <p className="text-sm text-surface-700 font-medium mt-1">{item.results}</p>
                          </div>
                        </div>
                      )}

                      {/* 操作 */}
                      <div className="pt-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all duration-200 group-hover:translate-x-1 cursor-pointer"
                        >
                          查看详情
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          )}

          {/* 底部分隔线 */}
          <div className="border-t border-surface-100" />
        </div>
      </section>

      <CtaSection 
        title="下一个成功案例"
        highlightText="就是您的"
        description="免费咨询，1 个工作日内为您定制专属方案"
      />

      <Footer />

      {/* 详情模态框 */}
      {isModalOpen && selectedCase && (
        <DetailModal 
          item={selectedCase} 
          onClose={handleCloseModal} 
          type="solution" 
        />
      )}
    </main>
  )
}
