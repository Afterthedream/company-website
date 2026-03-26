'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DetailModal, { ModalItem } from '@/components/DetailModal'
import { getSolutions } from '@/lib/strapi'
import { parseRichText } from '@/lib/richTextParser'

const defaultSolutions = [
  {
    title: '城市水环境治理',
    description: '为城市黑臭水体、污染河道提供系统性治理方案',
    features: ['黑臭水体治理', '河道生态修复', '雨污分流改造', '初期雨水处理'],
    cases: '已服务 30+ 城市，治理河道总长度超过 500 公里',
  },
  {
    title: '工业废水处理',
    description: '针对各类工业废水提供定制化处理解决方案',
    features: ['化工废水处理', '电镀废水处理', '印染废水处理', '零排放系统'],
    cases: '服务 200+ 工业企业，达标率 99% 以上',
  },
  {
    title: '农村污水治理',
    description: '为农村地区提供分散式、生态化污水处理方案',
    features: ['一体化处理设备', '人工湿地系统', '资源化利用', '智能运维'],
    cases: '覆盖 100+ 村庄，受益人口超过 50 万',
  },
  {
    title: '饮用水安全保障',
    description: '从水源地到水龙头的全流程饮用水安全保障',
    features: ['水源地保护', '水厂提标改造', '管网水质保障', '二次供水改造'],
    cases: '保障 500+ 万人饮水安全',
  },
  {
    title: '智慧水务建设',
    description: '运用物联网、大数据技术实现水务智能化',
    features: ['在线监测系统', '智能调度系统', '应急指挥系统', '移动应用平台'],
    cases: '建设 20+ 智慧水务平台',
  },
]

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null)

  useEffect(() => {
    getSolutions().then(data => setSolutions(data)).catch(() => setSolutions([]))
  }, [])

  const displaySolutions = solutions.length > 0 ? solutions : defaultSolutions

  return (
    <main className="min-h-screen">
      <Header />

      {/* 页面头部 */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">解决方案</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              针对不同场景，提供专业的定制化解决方案
            </p>
          </div>
        </div>
      </section>

      {/* 解决方案列表 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {displaySolutions.map((solution: any, index: number) => {
              let featuresArray: string[] = []
              if (solution.features) {
                if (Array.isArray(solution.features)) {
                  featuresArray = solution.features.map((f: any) => parseRichText(f))
                } else if (typeof solution.features === 'string') {
                  featuresArray = solution.features.split(',').map((f: string) => f.trim())
                }
              }
              if (featuresArray.length === 0 && defaultSolutions[index]) {
                featuresArray = defaultSolutions[index].features
              }

              return (
                <div
                  key={solution.id || index}
                  className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
                >
                  <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden">
                      {solution.image && (
                        <img
                          src={solution.image.url || '/placeholder.svg'}
                          alt={solution.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    <h2 className="text-3xl font-bold text-gray-900">{solution.title}</h2>
                    <p className="text-lg text-gray-600">
                      {parseRichText(solution.description) || solution.description || '提供专业的定制化解决方案'}
                    </p>

                    {featuresArray.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {featuresArray.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {solution.cases && (
                      <div className="bg-primary-50 rounded-xl p-4">
                        <p className="text-primary-700 font-medium">
                          {parseRichText(solution.cases)}
                        </p>
                      </div>
                    )}

                    <button
                      className="btn-primary mt-2"
                      onClick={() => setSelectedItem(solution)}
                    >
                      了解详情
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">没有找到适合的解决方案？</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            我们的专业团队可以为您量身定制专属解决方案
          </p>
          <a href='/contact'>
            <button className="bg-white text-primary-600 font-medium py-4 px-12 rounded-full hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              联系我们获取方案
            </button>
          </a>
        </div>
      </section>

      <Footer />

      {/* 详情弹窗 */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type="solution"
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  )
}
