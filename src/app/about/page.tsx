import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TencentMapSimple from '@/components/TencentMapSimple'
import { getCompanyInfo } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

// 默认公司信息（当 Strapi 没有数据时显示）
const defaultCompany = {
  name: '智汇泽润',
  description: '智汇泽润是一家专注于水资源治理与保护的科技企业，成立于 2005 年，总部位于北京。公司秉承"道法自然、上善若水"的理念，致力于为客户提供专业、高效、环保的水治理解决方案。公司拥有多项核心技术和专利，服务范围涵盖水处理技术、水生态修复、智慧水务、水环境监测等多个领域，已成功完成 500+ 个项目，客户遍布全国各地。',
  vision: '成为受人尊敬的水治理行业领导者，让每一滴水都充满生命力',
  mission: '用科技守护水资源，用专业创造美好环境',
  values: '诚信、创新、专业、共赢',
  phone: '400-XXX-XXXX',
  email: 'info@techwater.com',
  address: '北京市海淀区 XXX 路 XXX 号科技大厦 A 座 10 层',
  mapLongitude: 116.301234,
  mapLatitude: 39.982757,
  mapAddress: '北京市海淀区',
  workHours: '周一至周五：9:00-18:00\n周末及节假日：10:00-16:00',
  establishedYear: '2005',
  projectCount: 500,
}
export const dynamic = 'force-dynamic'
export default async function AboutPage() {
  // 从 Strapi 获取公司信息
  const company = await getCompanyInfo()

  // 合并数据：优先使用 Strapi 数据，否则使用默认值
  const companyData = {
    ...defaultCompany,
    ...company,
    name: company?.name || defaultCompany.name,
    description: parseRichText(company?.description) || defaultCompany.description,
    vision: parseRichText(company?.vision) || defaultCompany.vision,
    mission: parseRichText(company?.mission) || defaultCompany.mission,
    values: parseRichText(company?.values) || defaultCompany.values,
    phone: company?.phone || defaultCompany.phone,
    email: company?.email || defaultCompany.email,
    address: company?.address || defaultCompany.address,
    mapLongitude: company?.mapLongitude || defaultCompany.mapLongitude,
    mapLatitude: company?.mapLatitude || defaultCompany.mapLatitude,
    mapAddress: company?.mapAddress || defaultCompany.mapAddress,
    establishedYear: company?.establishedYear || defaultCompany.establishedYear,
    projectCount: company?.projectCount || defaultCompany.projectCount,
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* 页面头部 */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              关于我们
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {companyData.name} - 一站式水利信息化问题解决者
            </p>
          </div>
        </div>
      </section>

      {/* 公司简介 */}
      <section id="introduction" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden">
                {companyData.logo ? (
                  <img
                    src={companyData.logo.url || '/placeholder.svg'}
                    alt={companyData.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">公司简介</h2>
              <p className="text-gray-600 leading-relaxed">
                {companyData.description}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary-600">{companyData.establishedYear}</div>
                  <div className="text-gray-600">成立年份</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">{companyData.projectCount}+</div>
                  <div className="text-gray-600">成功案例</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 企业文化 */}
      <section id="culture" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">企业文化</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">愿景</h3>
              <p className="text-gray-600">
                {companyData.vision}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">使命</h3>
              <p className="text-gray-600">
                {companyData.mission}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">价值观</h3>
              <p className="text-gray-600">
                {companyData.values}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 公司信息 */}
      <section id="contact-info" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">找到我们</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系方式 */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">联系电话</h3>
                  <p className="text-gray-600">{companyData.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">电子邮箱</h3>
                  <p className="text-gray-600">{companyData.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">公司地址</h3>
                  <p className="text-gray-600">{companyData.address}</p>
                </div>
              </div>
            </div>

            {/* 地图 */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <TencentMapSimple
                  longitude={companyData.mapLongitude}
                  latitude={companyData.mapLatitude}
                  address={companyData.mapAddress || companyData.address}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
