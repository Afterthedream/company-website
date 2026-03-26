import Header from '@/components/Header'
import Hero from '@/components/Hero'
import AboutPreview from '@/components/AboutPreview'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import { getCompanyInfo, getProducts, getArticles } from '@/lib/strapi'
export const dynamic = 'force-dynamic'
export default async function Home() {
  // 从 Strapi 获取数据
  const company = await getCompanyInfo()
  const products = await getProducts()
  const articles = await getArticles()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero company={company} />
      <AboutPreview company={company} />
      <Services products={products} />
      <Features />
      <Footer />
    </main>
  )
}
