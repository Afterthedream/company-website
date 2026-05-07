'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCompanyLogo } from '@/lib/strapi'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    let ticking = false
    let lastScrollY = 0
    
    const handleScroll = () => {
      lastScrollY = window.scrollY
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchLogo = async () => {
      const logo = await getCompanyLogo()
      setLogoUrl(logo)
    }
    fetchLogo()
  }, [])

  const navItems = [
    { name: '首页', href: '/' },
    { name: '产品中心', href: '/products' },
    { name: '解决方案', href: '/solutions' },
    { name: '应用案例', href: '/cases' },
    { name: '新闻动态', href: '/news' },
    { name: '关于我们', href: '/about' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled || isMobileMenuOpen
          ? 'bg-surface-0/95 backdrop-blur-md shadow-lg dark:bg-surface-950/95 dark:shadow-primary-950/20'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28 lg:h-32">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 micro-interaction group"
          >
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-xl flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="四川沧杰荇科技有限公司"
                  width={96}
                  height={96}
                  loading="eager"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <svg
                  className="w-10 h-10 lg:w-12 lg:h-12 text-primary-600 group-hover:text-primary-500 transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-surface-900 via-primary-700 to-surface-900 dark:from-surface-100 dark:via-primary-500 dark:to-surface-100 bg-clip-text text-transparent leading-tight">
                四川沧杰荇科技有限公司
              </span>
              <span className="text-xs text-surface-500 dark:text-surface-400 font-medium tracking-wider hidden lg:block">
                CANGJIEXING TECHNOLOGY
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav aria-label="主导航" className="hidden md:flex items-center space-x-8 lg:space-x-10 xl:space-x-12">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium text-base transition-all duration-200 relative group py-2 ${
                    isActive ? 'text-primary-600' : 'text-surface-700 dark:text-surface-300 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full origin-center ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 micro-interaction focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg
                className="w-6 h-6 text-surface-700 dark:text-surface-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav
          id="mobile-nav"
          aria-label="移动导航"
          aria-hidden={!isMobileMenuOpen}
          {...(!isMobileMenuOpen && { inert: true as const })}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-3 border-t border-surface-200/80">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
              <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center min-h-[48px] py-3.5 px-4 font-medium text-base micro-interaction rounded-xl mb-1 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-950'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                {item.name}
              </Link>
              )
            })}

          </div>
        </nav>
      </div>
    </header>
  )
}
