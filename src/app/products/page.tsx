'use client'

import { useState, useEffect, useRef } from 'react'
import PageHeader from '@/components/PageHeader'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import CtaSection from '@/components/CtaSection'
import { ProductListSkeleton } from '@/components/Skeleton'
import { getProducts, getProductCategories } from '@/lib/strapi'
import { defaultProducts } from '@/lib/defaults'

const productIcons = [
  <svg key="treatment" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>,
  <svg key="ecology" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>,
  <svg key="smart" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>,
  <svg key="monitoring" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [displayCount, setDisplayCount] = useState(8) // 每页显示数量
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getProducts()
      .then((productsData) => {
        if (productsData && productsData.length > 0) {
          // 转换 Strapi 数据格式以适配前端显示
          const formattedProducts = productsData.map((product: any) => {
            // 处理 description（可能是数组或对象）
            let descText = '';
            if (Array.isArray(product.description)) {
              descText = product.description.map((item: any) => item.children?.map((c: any) => c.text).join('') || '').join('');
            } else if (typeof product.description === 'string') {
              descText = product.description;
            } else if (product.description?.markdown) {
              descText = product.description.markdown;
            }
            
            // 处理 features
            let featuresData = [];
            if (product.features) {
              if (Array.isArray(product.features)) {
                featuresData = product.features;
              } else if (typeof product.features === 'string') {
                featuresData = product.features.split(',').map((f: string) => f.trim());
              }
            }
            
            // 处理 specifications (注意：Strapi可能返回 Specifications 或 specifications)
            let specsData: { label: string; value?: string }[] = [];
            const specsRaw = product.specifications || product.Specifications;
            if (specsRaw) {
              if (Array.isArray(specsRaw)) {
                // 处理数组格式
                specsData = specsRaw.map((item: any) => {
                  if (typeof item === 'string') {
                    // 字符串格式如 "有效距离: 30m"，自动解析为 {label, value}
                    const parts = item.split(/[:：]/); // 支持中英文冒号
                    if (parts.length >= 2) {
                      return {
                        label: parts[0].trim(),
                        value: parts.slice(1).join(':').trim()
                      };
                    }
                    return { label: item };
                  }
                  // 如果已经是对象格式 {label: xxx, value: xxx}
                  if (typeof item === 'object' && item !== null) {
                    return {
                      label: item.label || item.name || String(item),
                      value: item.value || ''
                    };
                  }
                  return { label: String(item) };
                });
              } else if (typeof specsRaw === 'object' && specsRaw !== null) {
                // 处理对象格式 {"参数名": "参数值"} 或 {"分组": {"子参数": "值"}}
                for (const [key, val] of Object.entries(specsRaw)) {
                  if (typeof val === 'string') {
                    // 简单键值对
                    specsData.push({ label: key, value: val });
                  } else if (typeof val === 'object' && val !== null) {
                    // 嵌套对象，展开为多个条目
                    for (const [subKey, subVal] of Object.entries(val)) {
                      specsData.push({ 
                        label: `${key} - ${subKey}`, 
                        value: String(subVal) 
                      });
                    }
                  }
                }
              }
            }
            
            return {
              ...product,
              id: product.documentId || product.id,
              title: product.name || product.title,
              description: descText,
              features: featuresData,
              specifications: specsData,
              // 确保 category 的 id 和 documentId 都能用
              category: product.category ? {
                ...product.category,
                id: product.category.documentId || product.category.id,
                documentId: product.category.documentId || product.category.id,
              } : null,
            };
          });
          setProducts(formattedProducts);
        } else {
          setProducts(defaultProducts);
        }
      })
      .catch(() => {
        setProducts(defaultProducts);
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
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

  const displayProducts = products.slice(0, displayCount)
  const hasMore = displayCount < products.length

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8) // 每次再加载8个
  }

  const hasProducts = products.length > 0

  return (
    <main className="min-h-screen animate-page-enter" id="main-content">
      <PageHeader
        number="02"
        label="产品中心"
        title="产品与服务"
        description="提供全方位的水治理解决方案，满足不同客户的需求"
      />

      <section className="py-28 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-6xl mx-auto px-6">
          {/* 产品网格 */}
          {loading ? (
            <ProductListSkeleton count={4} />
          ) : !hasProducts ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface-100 dark:bg-surface-900 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">暂时还没有产品哦</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">敬请期待后续更新~</p>
            </div>
          ) : (
            <>
          <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayProducts.map((product: any, index: number) => (
              <div
                key={product.id || index}
                className={`group bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 h-full ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                  {/* 图片区 */}
                  <div className="relative h-52 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 overflow-hidden">
                    {(() => {
                      const img = product.image
                      const imgUrl = img
                        ? Array.isArray(img) ? img[0]?.url : img?.url
                        : null
                      const fullUrl = imgUrl
                        ? imgUrl.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imgUrl}`
                        : null
                      return fullUrl ? (
                        <img
                          src={fullUrl}
                          alt={product.name || product.title}
                          loading="lazy"
                          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-100 dark:bg-surface-900">
                          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm">
                            {product.icon || productIcons[0]}
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* 内容 */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-surface-300 dark:text-surface-600">{String(index + 1).padStart(2, '0')}</span>
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-700 transition-colors duration-200">
                      {product.title}
                    </h2>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-2">
                      {product.description || '暂无描述'}
                    </p>
                    <button
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors pt-1 micro-interaction"
                      onClick={() => setSelectedItem(product)}
                      aria-label={`了解${product.title}的详情`}
                    >
                      了解详情
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
              </div>
            ))}
          </div>

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="flex justify-center mt-16">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-white dark:bg-surface-900 border-2 border-primary-600 text-primary-600 font-medium rounded-xl hover:bg-primary-50 dark:hover:bg-surface-800 transition-all duration-300 micro-interaction shadow-md hover:shadow-lg"
              >
                加载更多
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </section>

      <CtaSection
        title="没有找到合适的"
        highlightText="产品"
        description="联系我们，我们将根据您的需求提供定制化的产品"
        buttonText="联系我们"
      />

      {selectedItem && (
        <DetailModal item={selectedItem} type="product" onClose={() => setSelectedItem(null)} />
      )}
    </main>
  )
}
