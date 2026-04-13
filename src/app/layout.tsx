import type { Metadata, Viewport } from 'next'
import { DM_Sans, Sora } from 'next/font/google'
import './globals.css'
import DynamicFavicon from '@/components/DynamicFavicon'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '四川沧杰荇科技有限公司',
  description: '一站式水利信息化问题解决者',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: '四川沧杰荇科技有限公司',
    description: '一站式水利信息化问题解决者',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '四川沧杰荇科技有限公司',
    description: '一站式水利信息化问题解决者',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: 'oklch(0.98 0.003 250)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${dmSans.variable} ${sora.variable}`}>
      <body className={`${dmSans.variable} ${sora.variable}`}>
        <ErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
          >
            跳转到主内容
          </a>
          <DynamicFavicon />
          <Header />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
