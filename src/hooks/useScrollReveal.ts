'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * 滚动进入视口时触发显示动画
 * @param threshold IntersectionObserver 阈值（默认 0.1）
 * @returns ref — 绑定到目标元素；isVisible — 元素是否进入视口
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.1
): { ref: (el: T | null) => void; isVisible: boolean } {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<T | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [threshold])

  const ref = (el: T | null) => {
    elementRef.current = el
    if (observerRef.current) {
      if (el) {
        observerRef.current.observe(el)
      } else {
        observerRef.current.disconnect()
      }
    }
  }

  return { ref, isVisible }
}
