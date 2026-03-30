import type { Metadata } from 'next'
import './globals.css'
import DynamicFavicon from '@/components/DynamicFavicon'

export const metadata: Metadata = {
  title: '四川沧杰荇科技有限公司',
  description: '一站式水利信息化问题解决者',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
        <DynamicFavicon />
        {children}
      </body>
    </html>
  )
}
