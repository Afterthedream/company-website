'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import CtaSection from '@/components/CtaSection'
import { ProductListSkeleton } from '@/components/Skeleton'
import { getProducts, getProductCategories, getStrapiMedia } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
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
      .finally(() => setLoading(false))
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
  }, [loading])

  const displayProducts = selectedCategory
    ? products.filter((p: any) => {
        const catId = p.category?.documentId || p.category?.id
        return catId === selectedCategory
      })
    : products

  const hasProducts = products.length > 0
  const hasCategories = categories.length > 0

  return (
    <main className="min-h-screen animate-page-enter">
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
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 micro-interaction ${
                  selectedCategory === null
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-surface-700 hover:bg-surface-100 border border-surface-200'
                }`}
              >
                全部
              </button>
              {categories.map((category: any) => (
                <button
                  key={category.id || category.documentId}
                  onClick={() => setSelectedCategory(category.documentId || category.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 micro-interaction ${
                    selectedCategory === (category.documentId || category.id)
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-surface-700 hover:bg-surface-100 border border-surface-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* 产品网格 */}
          {loading ? (
            <ProductListSkeleton count={4} />
          ) : !hasProducts ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">暂时还没有产品哦</h3>
              <p className="text-sm text-surface-400">敬请期待后续更新~</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayProducts.map((product: any, index: number) => {
                // 获取图片URL
                const img = product.image
                const imgUrl = img
                  ? (Array.isArray(img) ? img[0]?.url : img?.url)
                  : null
                const fullUrl = imgUrl
                  ? (imgUrl.startsWith('http') ? imgUrl : getStrapiMedia(imgUrl))
                  : null

                // 获取产品名称
                const productName = product.name || product.title || '未命名产品'
                
                // 获取描述
                const description = parseRichText(product.description) || product.description || '暂无描述'

                return (
                  <div
                    key={product.id || product.documentId || index}
                    className={`group bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 h-full ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* 图片区 */}
                    <div className="relative h-52 bg-gradient-to-br from-surface-50 to-surface-100 overflow-hidden">
                      {fullUrl ? (
                        <img 
                          src={fullUrl} 
                          alt={productName} 
                          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-surface-300">0{index + 1}</span>
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h2 className="text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors duration-200">
                        {productName}
                      </h2>
                      <p className="text-sm text-surface-400 leading-relaxed line-clamp-2">
                        {typeof description === 'string' ? description : '暂无描述'}
                      </p>
                      <button
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors pt-1 micro-interaction"
                        onClick={() => setSelectedItem(product)}
                      >
                        了解详情
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <CtaSection 
        title="没有找到合适的"
        highlightText="产品"
        description="免费咨询，1 个工作日内为您定制专属解决方案"
        buttonText="免费获取报价"
      />

      <Footer />

      {selectedItem && (
        <DetailModal item={selectedItem} type="product" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
