'use client'

import { useEffect, useRef } from 'react'

interface TencentMapProps {
  longitude: number
  latitude: number
  address?: string
  zoom?: number
  width?: string
  height?: string
}

declare global {
  interface Window {
    TMap: any
  }
}

const MAP_KEY = 'GRDBZ-VMFEQ-FN75C-4HYJZ-Y36R2-W5BUT'

export default function TencentMap({
  longitude,
  latitude,
  address = '公司位置',
  zoom = 15,
  width = '100%',
  height = '100%',
}: TencentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.TMap) return

      const center = new window.TMap.LatLng(latitude, longitude)

      const map = new window.TMap.Map(mapRef.current, {
        center,
        zoom,
        pitch: 0,
        rotation: 0,
      })

      // 添加标记点
      new window.TMap.MultiMarker({
        map,
        geometries: [
          {
            id: 'company-location',
            position: center,
          },
        ],
      })

      // 添加信息窗口
      new window.TMap.InfoWindow({
        map,
        position: center,
        content: `<div style="padding:6px 10px;font-size:14px;color:#333;">${address}</div>`,
        offset: { x: 0, y: -50 },
      })
    }

    // 若已加载过 SDK，直接初始化
    if (window.TMap) {
      initMap()
      return
    }

    // 动态加载腾讯地图 JS API GL
    const script = document.createElement('script')
    script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${MAP_KEY}`
    script.async = true
    script.onload = initMap
    script.onerror = () => console.error('腾讯地图 SDK 加载失败，请检查 API Key 或网络')
    document.head.appendChild(script)
  }, [latitude, longitude, address, zoom])

  return (
    <div
      ref={mapRef}
      style={{ width, height, borderRadius: '1rem', overflow: 'hidden' }}
      className="w-full h-full"
    />
  )
}
