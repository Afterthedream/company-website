import Hero from '@/components/Hero'
import AboutPreview from '@/components/AboutPreview'
import Services from '@/components/Services'
import Solutions from '@/components/Solutions'
import CasesPreview from '@/components/CasesPreview'
import NewsPreview from '@/components/NewsPreview'
import { getCompanyInfo, getProducts, getArticles, extractCompanyImage, getCases } from '@/lib/strapi'
export const dynamic = 'force-dynamic'
export default async function Home() {
  // 并行获取数据，company 数据只请求一次
  const [company, products, articles, cases] = await Promise.all([
    getCompanyInfo(),
    getProducts(),
    getArticles(),
    getCases(),
  ])
  const companyImage = extractCompanyImage(company)

  return (
    <main id="main-content" className="min-h-screen">
      <Hero company={company} />
      <Services products={products} />
      <Solutions />
      <CasesPreview cases={cases} />
      <AboutPreview company={company} companyImage={companyImage} />
      <NewsPreview articles={articles} />
    </main>
  )
}