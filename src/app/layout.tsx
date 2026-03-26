import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '四川沧杰荇科技有限公司',
  description: '一站式水利信息化问题解决者',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}
