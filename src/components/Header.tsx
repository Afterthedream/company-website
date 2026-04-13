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
          ? 'bg-surface-0/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 micro-interaction group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="四川沧杰荇科技有限公司"
                  width={48}
                  height={48}
                  loading="eager"
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg
                  className="w-7 h-7 text-primary-600 group-hover:text-primary-500 transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                </svg>
              )}
            </div>
            <div>
              <span className="text-xl font-bold text-surface-900 hidden lg:block">四川沧杰荇科技有限公司</span>
              <span className="text-base font-bold text-surface-900 lg:hidden">沧杰荇科技</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="主导航" className="hidden md:flex items-center space-x-6 lg:space-x-10 ml-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors duration-200 relative group py-1 ${
                  isActive ? 'text-primary-600' : 'text-surface-700 hover:text-primary-600'
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
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 micro-interaction focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
            >
              <svg
                className="w-6 h-6 text-surface-700"
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
          <div className="py-4 border-t border-surface-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center min-h-[44px] py-3.5 px-4 font-medium micro-interaction rounded-lg ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-surface-700 hover:bg-surface-50 hover:text-primary-600'
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
