'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'ecology',
    title: '水生态修复',
    description: '运用生态工程方法，恢复水体自净能力，构建健康的水生态系统',
    features: ['湿地生态修复', '河流生态修复', '湖泊生态修复', '水源地保护'],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  },
  {
    id: 'smart',
    title: '智慧水务',
    description: '融合物联网、大数据技术，实现水务系统的智能化监控与管理',
    features: ['智能监控系统', '数据分析平台', '远程控制系统', '预警预报系统'],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: 'monitoring',
    title: '水环境监测',
    description: '建立完善的水环境监测体系，实时掌握水质动态变化',
    features: ['水质在线监测', '水文监测', '污染源监测', '应急监测'],
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

  useEffect(() => {
    // 获取分类和产品数据
    Promise.all([
      getProductCategories(),
      getProducts()
    ]).then(([categoriesData, productsData]) => {
      setCategories(categoriesData)
      setProducts(productsData)
    }).catch((error) => {
      console.error('Error loading data:', error)
      setCategories([])
      setProducts([])
    })
  }, [])

  // 根据选择的分类筛选产品
  const displayProducts = selectedCategory 
    ? products.filter(p => p.category?.id === selectedCategory)
    : products
  
  // 如果没有数据，使用默认数据
  const finalProducts = displayProducts.length > 0 ? displayProducts : defaultProducts
  const hasCategories = categories.length > 0

  return (
    <main className="min-h-screen">
      <Header />

      {/* 页面头部 */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">产品中心</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              提供全方位的水治理解决方案，满足不同客户的需求
            </p>
          </div>
        </div>
      </section>

      {/* 产品列表 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 分类筛选按钮 */}
          {hasCategories && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {finalProducts.map((product: any, index: number) => (
              <div
                key={product.id || index}
                id={product.documentId || product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* 图片区域 */}
                <div className="relative h-48 bg-white">
                  {(() => {
                    const img = product.image
                    const imgUrl = img
                      ? (Array.isArray(img) ? img[0]?.url : img?.url)
                      : null
                    const fullUrl = imgUrl
                      ? (imgUrl.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imgUrl}`)
                      : null
                    return fullUrl ? (
                      <img
                        src={fullUrl}
                        alt={product.name || product.title}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        {product.icon || (
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* 内容区域 */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {product.name || product.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {parseRichText(product.description) || '暂无描述'}
                  </p>

                  <button
                    className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    onClick={() => setSelectedItem(product)}
                  >
                    了解详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">需要定制化的解决方案？</h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              我们的专业团队将根据您的具体需求，提供个性化的水治理解决方案
            </p>
            <a href="/contact">
              <button className="bg-white text-primary-600 font-medium py-4 px-12 rounded-full hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                联系我们
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* 详情弹窗 */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type="product"
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  )
}
