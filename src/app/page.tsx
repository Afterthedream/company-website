import Header from '@/components/Header'
import Hero from '@/components/Hero'
import AboutPreview from '@/components/AboutPreview'
import Services from '@/components/Services'
import Solutions from '@/components/Solutions'
import NewsPreview from '@/components/NewsPreview'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'
import { getCompanyInfo, getProducts, getArticles, getCompanyImage } from '@/lib/strapi'
export const dynamic = 'force-dynamic'
export default async function Home() {
  // 从 Strapi 获取数据
  const company = await getCompanyInfo()
  const products = await getProducts()
  const articles = await getArticles()
  const companyImage = await getCompanyImage()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero company={company} />
      <Services products={products} />
      <Solutions />
      <AboutPreview company={company} companyImage={companyImage} />
      <NewsPreview articles={articles} />
      <CtaSection />
      <Footer />
    </main>
  )
}