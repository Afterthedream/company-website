'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { getProducts, getProductCategories } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultProducts = [
  {
    id: 'treatment',
    title: '水处理技术',
    description: '先进的水处理工艺，提供从源头到终端的全流程水净化解决方案',
    features: ['物理处理技术', '化学处理技术', '生物处理技术', '膜分离技术'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'ecology',
    title: '水生态修复',
    description: '运用生态工程方法，恢复水体自净能力，构建健康的水生态系统',
    features: ['湿地生态修复', '河流生态修复', '湖泊生态修复', '水源地保护'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  },
  {
    id: 'smart',
    title: '智慧水务',
    description: '融合物联网、大数据技术，实现水务系统的智能化监控与管理',
    features: ['智能监控系统', '数据分析平台', '远程控制系统', '预警预报系统'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: 'monitoring',
    title: '水环境监测',
    description: '建立完善的水环境监测体系，实时掌握水质动态变化',
    features: ['水质在线监测', '水文监测', '污染源监测', '应急监测'],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([getProductCategories(), getProducts()])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData)
        setProducts(productsData)
      })
      .catch(() => {
        setCategories([])
        setProducts([])
      })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [])

  const displayProducts = selectedCategory
    ? products.filter((p) => p.category?.id === selectedCategory)
    : products

  const finalProducts = displayProducts.length > 0 ? displayProducts : defaultProducts
  const hasCategories = categories.length > 0

  return (
    <main className="min-h-screen">
      <Header />

      <PageHeader
        number="02"
        label="产品中心"
        title="产品与服务"
        description="提供全方位的水治理解决方案，满足不同客户的需求"
      />

      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* 分类筛选 */}
          {hasCategories && (
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-surface-900 text-white shadow-sm'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                全部
              </button>
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-surface-900 text-white shadow-sm'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* 产品网格 */}
          <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {finalProducts.map((product: any, index: number) => (
              <div
                key={product.id || index}
                className={`group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="card-surface overflow-hidden card-hover h-full">
                  {/* 图片区 */}
                  <div className="relative h-48 bg-surface-50 overflow-hidden">
                    {(() => {
                      const img = product.image
                      const imgUrl = img
                        ? Array.isArray(img) ? img[0]?.url : img?.url
                        : null
                      const fullUrl = imgUrl
                        ? imgUrl.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imgUrl}`
                        : null
                      return fullUrl ? (
                        <img src={fullUrl} alt={product.name || product.title} className="w-full h-full object-contain p-6" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-400">
                            {product.icon || defaultProducts[0].icon}
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* 内容 */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-surface-300">0{index + 1}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors duration-200">
                      {product.name || product.title}
                    </h2>
                    <p className="text-sm text-surface-400 leading-relaxed line-clamp-2">
                      {parseRichText(product.description) || '暂无描述'}
                    </p>
                    <button
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors pt-1"
                      onClick={() => setSelectedItem(product)}
                    >
                      了解详情
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-surface-900 overflow-hidden px-8 py-16 md:px-16 md:py-20 relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2">
                <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                  没有心仪的<span className="text-primary-300">应用产品</span>？
                </h2>
                <p className="text-sm text-surface-400">
                  我们将根据您的具体需求，提供合适的产品
                </p>
              </div>
              <a href="/contact" className="group inline-flex items-center gap-2 bg-white text-surface-900 font-semibold text-sm py-3.5 px-8 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-black/10 flex-shrink-0">
                联系我们
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {selectedItem && (
        <DetailModal item={selectedItem} type="product" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
