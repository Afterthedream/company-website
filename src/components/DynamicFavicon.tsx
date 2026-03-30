'use client'

import { useEffect } from 'react'
import { getCompanyLogo } from '@/lib/strapi'

export default function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const logoUrl = await getCompanyLogo()
        if (logoUrl) {
          // 创建或更新favicon link元素
          let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
          if (!favicon) {
            favicon = document.createElement('link')
            favicon.rel = 'icon'
            favicon.type = 'image/x-icon'
            document.getElementsByTagName('head')[0].appendChild(favicon)
          }
          favicon.href = logoUrl
          
          // 同时更新其他相关图标
          let shortcutIcon = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement
          if (!shortcutIcon) {
            shortcutIcon = document.createElement('link')
            shortcutIcon.rel = 'shortcut icon'
            shortcutIcon.type = 'image/x-icon'
            document.getElementsByTagName('head')[0].appendChild(shortcutIcon)
          }
          shortcutIcon.href = logoUrl
          
          let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
          if (!appleIcon) {
            appleIcon = document.createElement('link')
            appleIcon.rel = 'apple-touch-icon'
            document.getElementsByTagName('head')[0].appendChild(appleIcon)
          }
          appleIcon.href = logoUrl
        }
      } catch (error) {
        console.error('Error updating favicon:', error)
      }
    }
    
    updateFavicon()
  }, [])

  return null // 这个组件不渲染任何内容
}