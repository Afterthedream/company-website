import Header from '@/components/Header'
import Hero from '@/components/Hero'
import AboutPreview from '@/components/AboutPreview'
import Services from '@/components/Services'
import Solutions from '@/components/Solutions'
import CasesPreview from '@/components/CasesPreview'
import NewsPreview from '@/components/NewsPreview'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'
import { getCompanyInfo, getProducts, getArticles, getCompanyImage, getCases } from '@/lib/strapi'
export const dynamic = 'force-dynamic'
export default async function Home() {
  // 从 Strapi 获取数据
  const company = await getCompanyInfo()
  const products = await getProducts()
  const articles = await getArticles()
  const companyImage = await getCompanyImage()
  const cases = await getCases()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero company={company} />
      <Services products={products} />
      <Solutions />
      <CasesPreview cases={cases} />
      <AboutPreview company={company} companyImage={companyImage} />
      <NewsPreview articles={articles} />
      <CtaSection />
      <Footer />
    </main>
  )
}