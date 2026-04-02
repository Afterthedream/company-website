'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

/**
 * 滚动进入视口时触发显示动画
 * @param threshold IntersectionObserver 阈值（默认 0.1）
 * @returns ref — 绑定到目标元素；isVisible — 元素是否进入视口
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.1
): { ref: RefObject<T | null>; isVisible: boolean } {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
