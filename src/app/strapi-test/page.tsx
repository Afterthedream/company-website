'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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

interface Product {
  id: number
  documentId: string
  name: string
  description: string | null
  features: any
  order: number
}

interface Article {
  id: number
  documentId: string
  title: string
  excerpt: string | null
  category: string
  publishedAt: string
}

export default function StrapiTestPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
        
        // 获取所有数据
        const [companiesRes, productsRes, articlesRes] = await Promise.all([
          fetch(`${STRAPI_URL}/api/companies?populate=*`),
          fetch(`${STRAPI_URL}/api/products?populate=*&sort=order:asc`),
          fetch(`${STRAPI_URL}/api/articles?populate=*`)
        ])

        if (!companiesRes.ok) throw new Error('Failed to fetch companies')
        if (!productsRes.ok) throw new Error('Failed to fetch products')
        if (!articlesRes.ok) throw new Error('Failed to fetch articles')

        const companiesData = await companiesRes.json()
        const productsData = await productsRes.json()
        const articlesData = await articlesRes.json()

        setCompanies(companiesData.data || [])
        setProducts(productsData.data || [])
        setArticles(articlesData.data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold">正在加载 Strapi 数据...</h1>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* 页面头部 */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Strapi 数据测试
            </h1>
            <p className="text-xl text-gray-600">
              验证 Strapi CMS 数据是否正确连接到前端
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                ❌ 错误：{error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 公司信息 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">📄 公司信息 (Companies)</h2>
          {companies.length === 0 ? (
            <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg">
              ⚠️ 暂无数据 - 请在 Strapi 后台添加公司信息
            </div>
          ) : (
            <div className="grid gap-6">
              {companies.map((company) => (
                <div key={company.id} className="p-6 border rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-primary-600 mb-2">
                    {company.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>ID:</strong> {company.documentId}
                  </p>
                  {company.description && (
                    <p className="text-gray-700 mb-2">
                      <strong>简介:</strong> {parseRichText(company.description)}
                    </p>
                  )}
                  {company.vision && (
                    <p className="text-gray-700 mb-2">
                      <strong>愿景:</strong> {parseRichText(company.vision)}
                    </p>
                  )}
                  {company.mission && (
                    <p className="text-gray-700 mb-2">
                      <strong>使命:</strong> {parseRichText(company.mission)}
                    </p>
                  )}
                  {company.values && (
                    <p className="text-gray-700">
                      <strong>价值观:</strong> {parseRichText(company.values)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 产品服务 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">🛠️ 产品/服务 (Products)</h2>
          {products.length === 0 ? (
            <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg">
              ⚠️ 暂无数据 - 请在 Strapi 后台添加产品
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="p-6 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>排序:</strong> {product.order}
                  </p>
                  {product.description && (
                    <p className="text-gray-700 text-sm">
                      {parseRichText(product.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 新闻文章 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">📰 新闻文章 (Articles)</h2>
          {articles.length === 0 ? (
            <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg">
              ⚠️ 暂无数据 - 请在 Strapi 后台添加新闻
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="p-6 border rounded-lg">
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>分类:</strong> {article.category}
                  </p>
                  {article.excerpt && (
                    <p className="text-gray-700 text-sm">
                      {parseRichText(article.excerpt)}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 操作指南 */}
      <section className="py-12 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">📝 如何添加数据</h2>
          <div className="bg-white p-6 rounded-lg">
            <ol className="list-decimal list-inside space-y-3">
              <li>访问 Strapi 后台：<a href="http://localhost:1337/admin" className="text-primary-600 underline" target="_blank">http://localhost:1337/admin</a></li>
              <li>点击 <strong>Content Manager</strong></li>
              <li>选择内容类型（Company / Product / Article）</li>
              <li>点击 <strong>Create new entry</strong></li>
              <li>填写信息后点击 <strong>Publish</strong></li>
              <li>刷新本页面查看效果</li>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
