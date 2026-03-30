'use client'

import Link from 'next/link'
import { parseRichText } from '@/lib/richTextParser'

interface Product {
  id: number
  documentId: string
  name: string
  description: string | null
  features?: any
  order?: number
}

interface ServicesProps {
  products?: Product[]
}

// 默认服务数据（当 Strapi 没有数据时显示）
const defaultServices = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: '水处理技术',
    description: '采用先进的水处理工艺，提供从源头到终端的全流程水净化解决方案。',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: '水生态修复',
    description: '运用生态工程方法，恢复水体自净能力，构建健康的水生态系统。',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: '智慧水务',
    description: '融合物联网、大数据技术，实现水务系统的智能化监控与管理。',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: '水环境监测',
    description: '建立完善的水环境监测体系，实时掌握水质动态变化。',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: '技术咨询',
    description: '提供专业的技术咨询服务，为客户量身定制最优解决方案。',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: '工程总包',
    description: '提供 EPC 工程总承包服务，从设计到施工一站式服务。',
  },
]

export default function Services({ products = [] }: ServicesProps) {
  // 如果有 Strapi 产品数据则使用，否则使用默认数据
  const allServices = products.length > 0 ? products : defaultServices
  // 只显示前3个产品
  const services = allServices.slice(0, 3)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
            <span className="text-primary-600 font-medium">核心业务</span>
          </div>
          <h2 className="section-title">产品与服务</h2>
          <p className="section-subtitle">
            我们提供全方位的水治理解决方案，满足不同客户的需求
          </p>
        </div>

        {/* 服务卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item: any, index: number) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl p-8 card-hover shadow-md hover:shadow-primary-200/50"
            >
              {item.icon ? (
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.name || item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {parseRichText(item.description) || '提供专业的解决方案，满足您的各种需求。'}
              </p>
              {item.features && (
                <div className="mt-4 text-sm text-gray-500">
                  {parseRichText(item.features)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 查看更多 */}
        <div className="text-center mt-12">
          <Link href="/" className="btn-primary">
            查看所有产品
          </Link>
        </div>
      </div>
    </section>
  )
}
