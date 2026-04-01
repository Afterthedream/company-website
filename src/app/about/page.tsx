import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import TencentMapSimple from '@/components/TencentMapSimple'
import { getCompanyInfo, getCompanyImage } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultCompany = {
  name: '四川沧杰荇科技',
  description: '智汇泽润是一家专注于水资源治理与保护的科技企业，秉承"道法自然、上善若水"的理念，致力于为客户提供专业、高效、环保的水治理解决方案。',
  vision: '成为受人尊敬的水治理行业领导者，让每一滴水都充满生命力',
  mission: '用科技守护水资源，用专业创造美好环境',
  values: '诚信、创新、专业、共赢',
  phone: '400-XXX-XXXX',
  email: 'contact@cjx-tech.com',
  address: '成都市双流区新通大道777号',
  mapLongitude: 104.066,
  mapLatitude: 30.572,
  mapAddress: '成都市双流区',
  establishedYear: '2005',
  projectCount: 500,
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const company = await getCompanyInfo()
  const companyImage = await getCompanyImage()

  const data = {
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
  }

  const culture = [
    { title: '愿景', text: data.vision, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    )},
    { title: '使命', text: data.mission, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )},
    { title: '价值观', text: data.values, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    )},
  ]

  return (
    <main className="min-h-screen animate-page-enter">
      <Header />

      <PageHeader
        number="06"
        label="关于我们"
        title="关于沧杰荇"
        description="一站式水利信息化问题解决者"
      />

      {/* 公司简介 */}
      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* 图片 */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-100 aspect-[4/3]">
              {companyImage ? (
                <img src={companyImage} alt={data.name} className="w-full h-full object-cover" />
              ) : null}
              <div className="absolute -bottom-3 -left-3 w-full h-full rounded-2xl border border-primary-100 -z-10" />
            </div>

            {/* 内容 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold text-primary-600 tracking-wider">01</span>
                  <div className="w-8 h-px bg-primary-200" />
                  <span className="text-xs text-surface-400">公司简介</span>
                </div>
                <h2 className="section-title">{data.name}</h2>
                <p className="text-surface-500 leading-relaxed text-[15px]">{data.description}</p>
              </div>

              <div className="flex gap-10">
                <div>
                  <div className="font-display text-3xl font-bold text-primary-600">{data.establishedYear}</div>
                  <div className="text-xs text-surface-400 mt-1">成立年份</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary-600">{data.projectCount}+</div>
                  <div className="text-xs text-surface-400 mt-1">成功案例</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 企业文化 */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary-200" />
              <span className="text-xs font-semibold text-primary-600 tracking-widest uppercase">企业文化</span>
              <div className="w-8 h-px bg-primary-200" />
            </div>
            <h2 className="section-title">我们的理念</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {culture.map((item, i) => (
              <div key={i} className="card-surface p-8 card-hover">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-5">
                  {item.icon}
                </div>
                <span className="text-[11px] font-mono text-surface-300 block mb-2">0{i + 1}</span>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 公司信息 */}
      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary-200" />
              <span className="text-xs font-semibold text-primary-600 tracking-widest uppercase">联系方式</span>
              <div className="w-8 h-px bg-primary-200" />
            </div>
            <h2 className="section-title">公司信息</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系方式 */}
            <div className="space-y-6">
              {[
                { icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                ), label: '联系电话', value: data.phone },
                { icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                ), label: '电子邮箱', value: data.email },
                { icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ), label: '公司地址', value: data.address },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-surface-50 hover:bg-surface-100/80 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-surface-400 mb-0.5">{item.label}</div>
                    <div className="text-sm font-medium text-surface-800">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 地图 */}
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-surface-200/50 h-[360px]">
              <TencentMapSimple
                longitude={data.mapLongitude}
                latitude={data.mapLatitude}
                address={data.mapAddress || data.address}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
