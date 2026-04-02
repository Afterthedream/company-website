'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { ContactPageSkeleton } from '@/components/Skeleton'
import { getCompanyInfo, submitContact } from '@/lib/strapi'

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
  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [companyInfo, setCompanyInfo] = useState({
    phone: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 添加延迟，确保骨架屏有足够时间显示
    const timer = setTimeout(async () => {
      try {
        const company = await getCompanyInfo()
        if (company) {
          setCompanyInfo({
            phone: company.phone || '',
            email: company.email || '',
            address: company.address || '',
          })
        }
      } catch (error) {
        console.error('Failed to fetch company info:', error)
      } finally {
        setLoading(false)
      }
    }, 500) // 500ms延迟，确保骨架屏显示

    return () => clearTimeout(timer)
  }, [])

  const validate = () => {
    const newErrors: Partial<typeof formData> = {}
    if (!formData.name.trim()) newErrors.name = '请输入姓名'
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }
    if (formData.phone && !/^[\d\s\-+()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = '电话格式不正确'
    }
    if (!formData.message.trim()) newErrors.message = '请输入留言内容'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    setSubmitResult(null)
    try {
      await submitContact(formData)
      setSubmitResult('success')
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
      setTimeout(() => setSubmitResult(null), 5000)
    } catch {
      setSubmitResult('error')
      setTimeout(() => setSubmitResult(null), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const contactItems = [
    {
      icon: <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      label: '电话咨询',
      value: companyInfo.phone,
      href: companyInfo.phone ? `tel:${companyInfo.phone}` : undefined,
    },
    {
      icon: <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: '邮箱联系',
      value: companyInfo.email,
      href: companyInfo.email ? `mailto:${companyInfo.email}` : undefined,
    },
    {
      icon: <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: '公司地址',
      value: companyInfo.address,
      href: undefined,
    },
  ]

  // 显示骨架屏
  if (loading) {
    return (
      <main className="min-h-screen">
        <PageHeader number="07" label="联系我们" title="联系我们" description="如有任何疑问或需求，欢迎随时与我们联系" />
        <ContactPageSkeleton />
      </main>
    )
  }

  // 显示实际内容
  return (
    <main className="min-h-screen animate-page-enter">
      <PageHeader
        number="07"
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
                  <span className="text-xs text-surface-500">联系方式</span>
                </div>
                <h2 className="section-title mb-2">随时联系我们</h2>
                <p className="text-sm text-surface-500 leading-relaxed">
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
                      <div className="text-xs text-surface-500 mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-surface-800 hover:text-primary-600 transition-colors duration-200">{item.value}</a>
                      ) : (
                        <div className="text-sm font-medium text-surface-800">{item.value}</div>
                      )}
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
                <span className="text-xs text-surface-500">向我们留言</span>
              </div>
              <h2 className="section-title mb-8">发送留言</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-surface-600 mb-1.5">姓名 *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors(prev => ({ ...prev, name: undefined })) }}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`w-full px-4 py-3 bg-surface-50 border rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:ring-1 transition-all duration-200 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-surface-200 focus:border-primary-400 focus:ring-primary-400'}`}
                      placeholder="张三"
                    />
                    {errors.name && <p id="name-error" className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-surface-600 mb-1.5">公司</label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-200"
                      placeholder="四川沧杰荇科技有限公司"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-surface-600 mb-1.5">邮箱 *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors(prev => ({ ...prev, email: undefined })) }}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full px-4 py-3 bg-surface-50 border rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:ring-1 transition-all duration-200 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-surface-200 focus:border-primary-400 focus:ring-primary-400'}`}
                      placeholder="zhangsan@example.com"
                    />
                    {errors.email && <p id="email-error" className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-surface-600 mb-1.5">电话</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors(prev => ({ ...prev, phone: undefined })) }}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      className={`w-full px-4 py-3 bg-surface-50 border rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:ring-1 transition-all duration-200 ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-surface-200 focus:border-primary-400 focus:ring-primary-400'}`}
                      placeholder="13800000000"
                    />
                    {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-surface-600 mb-1.5">留言内容 *</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => { setFormData({ ...formData, message: e.target.value }); setErrors(prev => ({ ...prev, message: undefined })) }}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-4 py-3 bg-surface-50 border rounded-xl text-sm text-surface-800 placeholder:text-surface-300 focus:outline-none focus:ring-1 transition-all duration-200 resize-none ${errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-surface-200 focus:border-primary-400 focus:ring-primary-400'}`}
                    placeholder="请描述您的项目需求、预算范围或任何疑问..."
                  />
                  {errors.message && <p id="message-error" className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {submitting ? '正在发送...' : '提交留言'}
                </button>

                {/* 提交结果提示 */}
                {submitResult && (
                  <div role="alert" aria-live="polite" className={`flex items-center gap-3 p-4 rounded-xl animate-fade-in-up ${
                    submitResult === 'success' 
                      ? 'bg-accent-50 text-accent-600 border border-accent-200' 
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {submitResult === 'success' ? (
                      <>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">您的消息</span>
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
    </main>
  )
}
