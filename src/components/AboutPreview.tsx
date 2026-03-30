'use client'

import Link from 'next/link'
import { parseRichText } from '@/lib/richTextParser'

interface Company {
  id: number
  documentId: string
  name: string
  description: string | null
  vision: string | null
  mission: string | null
  values: string | null
}

interface AboutPreviewProps {
  company?: Company | null
  companyImage?: string | null
}

export default function AboutPreview({ company, companyImage }: AboutPreviewProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 图片区域 */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden">
              {companyImage ? (
                <img
                  src={companyImage}
                  alt="公司照片"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-48 h-48 text-primary-400/50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                </div>
              )}
            </div>
            {/* 装饰元素 */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-300/10 rounded-full blur-2xl" />
          </div>

          {/* 文字内容 */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-full">
              <span className="text-primary-600 font-medium">关于我们</span>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {parseRichText(company?.description) || '智汇泽润是一家专注于水资源治理与保护的科技企业，秉承"道法自然、上善若水"的理念，致力于为客户提供专业、高效、环保的水治理解决方案。'}
            </p>
            
            {(company?.vision || company?.mission || company?.values) && (
              <div className="space-y-4">
                {company?.vision && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">企业愿景</h3>
                      <p className="text-gray-600">{parseRichText(company.vision)}</p>
                    </div>
                  </div>
                )}
                
                {company?.mission && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">企业使命</h3>
                      <p className="text-gray-600">{parseRichText(company.mission)}</p>
                    </div>
                  </div>
                )}
                
                {company?.values && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">核心价值观</h3>
                      <p className="text-gray-600">{parseRichText(company.values)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <Link href="/about" className="inline-block btn-primary">
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
