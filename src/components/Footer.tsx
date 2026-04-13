'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCompanyInfo, getCompanyLogo } from '@/lib/strapi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const [address, setAddress] = useState('成都市双流区新通大道777号2栋1单元1203号')
  const [phone, setPhone]     = useState('028-86045168')
  const [email, setEmail]     = useState('742035754@qq.com')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    getCompanyInfo().then(company => {
      if (company?.address) setAddress(company.address)
      if (company?.phone)   setPhone(company.phone)
      if (company?.email)   setEmail(company.email)
    }).catch(() => {})

    getCompanyLogo().then(logo => {
      setLogoUrl(logo)
    }).catch(() => {})
  }, [])

  const NAV_GROUPS = [
    {
      title: '关于我们',
      links: [
        { name: '公司简介', href: '/about' },
        { name: '企业文化', href: '/about#culture' },
        { name: '公司信息', href: '/about#contact-info' },
      ],
    },
    {
      title: '产品与服务',
      links: [
        { name: '产品中心', href: '/products' },
        { name: '解决方案', href: '/solutions' },
        { name: '应用案例', href: '/cases' },
      ],
    },
    {
      title: '新闻动态',
      links: [
        { name: '公司新闻', href: '/news' },
        { name: '行业资讯', href: '/news?category=industry' },
      ],
    },
  ]

  return (
    <footer className="bg-surface-950 text-white relative">
      {/* 波浪分隔线 */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] overflow-hidden leading-none">
        <svg className="relative block w-full h-10 sm:h-12 lg:h-14" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z"
            fill="var(--footer-wave)"
          />
        </svg>
      </div>

      {/* ── 主体 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

          {/* 左：品牌 + 联系 */}
          <div className="lg:max-w-xs xl:max-w-sm flex-shrink-0 space-y-4">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="四川沧杰荇科技有限公司 Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">四川沧杰荇科技有限公司</span>
                <span className="text-[10px] text-surface-200">SICHUAN CANGJIEXING TECHNOLOGY CO,LTD</span>
              </div>
            </Link>

            {/* 简介 */}
            <p className="text-surface-200 text-xs leading-relaxed">
              以水为脉，以智为器，以服为桥——专注水资源治理与保护，让每一滴水都被精准守护，每一项水治理都可持续。
            </p>

            {/* 联系方式 */}
            <ul className="space-y-2 pt-1">
              {/* 地址 */}
              <li className="flex items-center gap-2 text-xs text-surface-200">
                <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
              {/* 电话 */}
              <li className="flex items-center gap-2 text-xs text-surface-200">
                <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone}`} className="hover:text-primary-400 transition-colors duration-200">{phone}</a>
              </li>
              {/* 邮箱 */}
              <li className="flex items-center gap-2 text-xs text-surface-200">
                <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-primary-400 transition-colors duration-200">{email}</a>
              </li>
            </ul>
          </div>

          {/* 分割线（仅大屏竖向） */}
          <div className="hidden lg:block w-px bg-surface-800 self-stretch" />

          {/* 右：导航，3 列排列 */}
          <div className="grid grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-[11px] font-semibold text-surface-300 tracking-wider uppercase mb-3">
                  {group.title}
                </h3>
                <ul className="space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group/link relative block py-1.5 pl-0 text-xs text-surface-400 hover:text-white transition-colors duration-200"
                      >
                        {/* 左侧指示条滑入 */}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-3.5 bg-primary-500 rounded-full transition-all duration-300 ease-out group-hover/link:w-0.5 group-hover/link:opacity-100 opacity-0" />
                        {/* 文字微右移 + 底部渐变下划线 */}
                        <span className="relative inline-flex items-center gap-1.5">
                          <span className="transition-transform duration-200 ease-out group-hover/link:translate-x-0.5">
                            {link.name}
                          </span>
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── 底部版权栏 ── */}
      <div className="border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-surface-400 text-xs">
            © {currentYear} 四川沧杰荇科技有限公司 All Rights Reserved.
          </p>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            className="text-surface-400 hover:text-surface-300 text-xs transition-colors duration-200"
          >
            蜀ICP备2024XXXXXX号
          </a>
        </div>
      </div>

    </footer>
  )
}
