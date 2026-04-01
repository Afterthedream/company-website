interface SkeletonProps {
  className?: string
}

function SkeletonBase({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-surface-200 rounded-lg ${className}`}
    />
  )
}

// 新闻卡片骨架
export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <SkeletonBase className="aspect-[16/10] rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <SkeletonBase className="h-5 w-16 rounded-md" />
          <SkeletonBase className="h-4 w-20 rounded" />
        </div>
        <SkeletonBase className="h-5 w-full rounded" />
        <SkeletonBase className="h-5 w-3/4 rounded" />
        <SkeletonBase className="h-4 w-full rounded" />
        <SkeletonBase className="h-4 w-2/3 rounded" />
      </div>
    </div>
  )
}

// 新闻列表骨架
export function NewsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <NewsCardSkeleton />
        </div>
      ))}
    </div>
  )
}

// 产品卡片骨架
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <SkeletonBase className="h-52 rounded-none rounded-t-2xl" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonBase className="h-4 w-8 rounded" />
          <SkeletonBase className="h-2 w-2 rounded-full" />
        </div>
        <SkeletonBase className="h-6 w-3/4 rounded" />
        <SkeletonBase className="h-4 w-full rounded" />
        <SkeletonBase className="h-4 w-2/3 rounded" />
        <SkeletonBase className="h-4 w-20 rounded" />
      </div>
    </div>
  )
}

// 产品列表骨架
export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  )
}

// 解决方案卡片骨架
export function SolutionCardSkeleton() {
  return (
    <div className="border-t border-surface-100">
      <div className="py-12 md:py-16 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
        {/* 左侧 */}
        <div className="flex-shrink-0 lg:w-[340px] space-y-4">
          <SkeletonBase className="h-20 w-24 rounded" />
          <SkeletonBase className="aspect-[4/3] rounded-2xl" />
        </div>
        {/* 右侧 */}
        <div className="flex-1 space-y-6 lg:pt-4">
          <SkeletonBase className="h-8 w-48 rounded" />
          <SkeletonBase className="h-5 w-full rounded" />
          <SkeletonBase className="h-5 w-3/4 rounded" />
          <div className="flex flex-wrap gap-2.5">
            <SkeletonBase className="h-9 w-24 rounded-xl" />
            <SkeletonBase className="h-9 w-28 rounded-xl" />
            <SkeletonBase className="h-9 w-20 rounded-xl" />
          </div>
          <SkeletonBase className="h-5 w-32 rounded" />
        </div>
      </div>
    </div>
  )
}

// 解决方案列表骨架
export function SolutionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <SolutionCardSkeleton />
        </div>
      ))}
      <div className="border-t border-surface-100" />
    </div>
  )
}

// 案例卡片骨架
export function CaseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <SkeletonBase className="md:w-2/5 aspect-[4/3] md:aspect-auto rounded-none" />
        <div className="md:w-3/5 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <SkeletonBase className="h-6 w-20 rounded-lg" />
            <SkeletonBase className="h-4 w-24 rounded" />
          </div>
          <SkeletonBase className="h-7 w-3/4 rounded" />
          <SkeletonBase className="h-5 w-32 rounded" />
          <SkeletonBase className="h-4 w-full rounded" />
          <SkeletonBase className="h-4 w-2/3 rounded" />
          <SkeletonBase className="h-5 w-48 rounded" />
          <SkeletonBase className="h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  )
}

// 案例列表骨架
export function CaseListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CaseCardSkeleton />
        </div>
      ))}
    </div>
  )
}

// 首页产品/服务卡片骨架
export function ServiceCardSkeleton() {
  return (
    <div className="h-full p-8 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
      <div className="flex items-center justify-between mb-7">
        <SkeletonBase className="w-14 h-14 rounded-2xl bg-surface-700/20" />
        <SkeletonBase className="w-2 h-2 rounded-full bg-surface-700/20" />
      </div>
      <SkeletonBase className="h-6 w-32 rounded mb-3 bg-surface-700/20" />
      <SkeletonBase className="h-4 w-full rounded mb-2 bg-surface-700/20" />
      <SkeletonBase className="h-4 w-3/4 rounded mb-6 bg-surface-700/20" />
      <SkeletonBase className="h-4 w-20 rounded bg-surface-700/20" />
    </div>
  )
}

// 首页服务列表骨架
export function ServiceListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <ServiceCardSkeleton />
        </div>
      ))}
    </div>
  )
}

export default SkeletonBase
