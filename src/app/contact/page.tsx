'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null)
  const [companyInfo, setCompanyInfo] = useState({
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/companies?populate=*`)
      .then(res => res.json())
      .then(data => {
        if (data.data?.[0]) {
          const c = data.data[0]
          setCompanyInfo({
            phone: c.phone || '',
            email: c.email || '',
            address: c.address || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })
      if (response.ok) {
        setSubmitResult('success')
        setFormData({ name: '', email: '', phone: '', company: '', message: '' })
        setTimeout(() => setSubmitResult(null), 5000)
      } else {
        setSubmitResult('error')
        setTimeout(() => setSubmitResult(null), 5000)
      }
    } catch {
      setSubmitResult('error')
      setTimeout(() => setSubmitResult(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const contactItems = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      label: '电话咨询',
      value: companyInfo.phone,
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: '邮箱联系',
      value: companyInfo.email,
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: '公司地址',
      value: companyInfo.address,
    },
  ]

  return (
    <main className="min-h-screen">
      <Header />

      <PageHeader
        number="06"
        label="联系我们"
        title="联系我们"
        description="如有任何疑问或需求，欢迎随时与我们联系"
      />

      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* 左：联系信息 */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-display text-sm font-bold text-primary-600 tracking-wider">01</span>
                  <div className="w-8 h-px bg-primary-200" />
                  <span className="text-xs text-surface-400">联系方式</span>
                </div>
                <h2 className="section-title mb-2">随时联系我们</h2>
                <p className="text-sm text-surface-400 leading-relaxed">
                  我们期待与您合作，为您提供最优质的水治理解决方案
                </p>
              </div>

              <div className="space-y-4">
                {contactItems.map((item, i) => (
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
            </div>

            {/* 右：表单 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-sm font-bold text-primary-600 tracking-wider">02</span>
                <div className="w-8 h-px bg-primary-200" />
                <span className="text-xs text-surface-400">在线留言</span>
              </div>
              <h2 className="section-title mb-8">发送消息</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-surface-600 mb-1.5">姓名 *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400 transition-all duration-200"
                      placeholder="张三"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-surface-600 mb-1.5">公司</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-200"
                      placeholder="沧杰荇科技"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-surface-600 mb-1.5">邮箱 *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-200"
                      placeholder="zhangsan@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-surface-600 mb-1.5">电话</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-200"
                      placeholder="138-0000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-surface-600 mb-1.5">留言内容 *</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:border-warm-400 focus:ring-1 focus:ring-warm-400 transition-all duration-200 resize-none"
                    placeholder="请描述您的项目需求、预算范围或任何疑问..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {submitting ? '正在发送...' : '免费咨询，1 个工作日回复'}
                </button>

                {/* 提交结果提示 */}
                {submitResult && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl animate-fade-in-up ${
                    submitResult === 'success' 
                      ? 'bg-accent-50 text-accent-600 border border-accent-200' 
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {submitResult === 'success' ? (
                      <>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">消息已发送！我们会在 1-2 个工作日内回复您 🎉</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">发送失败，请稍后重试或直接拨打电话</span>
                      </>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
