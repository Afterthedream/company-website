interface SkeletonProps {
  className?: string
  shimmer?: boolean
}

function SkeletonBase({ className = '', shimmer = false }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg ${shimmer ? 'skeleton-shimmer' : 'animate-pulse bg-surface-200'} ${className}`}
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

// 解决方案卡片骨架 — 精确匹配真实卡片布局
export function SolutionCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-surface-200 shadow-lg p-8 md:p-10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
        {/* 左：图标 + 编号 */}
        <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-3 flex-shrink-0">
          <SkeletonBase shimmer className="w-12 h-12 rounded-xl" />
          <SkeletonBase shimmer className="w-5 h-3 rounded" />
        </div>

        {/* 右：内容 */}
        <div className="flex-1 space-y-4">
          {/* 标题 */}
          <div className="space-y-2">
            <SkeletonBase shimmer className="h-6 w-48 rounded" />
            <SkeletonBase shimmer className="h-4 w-full rounded" />
            <SkeletonBase shimmer className="h-4 w-4/5 rounded" />
          </div>

          {/* 特性标签 */}
          <div className="flex flex-wrap gap-2 pt-1">
            <SkeletonBase shimmer className="h-7 w-20 rounded-lg" />
            <SkeletonBase shimmer className="h-7 w-24 rounded-lg" />
            <SkeletonBase shimmer className="h-7 w-16 rounded-lg" />
            <SkeletonBase shimmer className="h-7 w-20 rounded-lg" />
          </div>

          {/* 案例数据 */}
          <SkeletonBase shimmer className="h-4 w-56 rounded" />

          {/* 了解详情链接 */}
          <SkeletonBase shimmer className="h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

// 解决方案列表骨架
export function SolutionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <SolutionCardSkeleton key={i} delay={i * 120} />
      ))}
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

// 关于我们页面骨架
export function AboutPageSkeleton() {
  return (
    <div className="space-y-28">
      {/* 公司简介 */}
      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* 图片 */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-100 aspect-[4/3]">
              <SkeletonBase className="w-full h-full" />
              <div className="absolute -bottom-3 -left-3 w-full h-full rounded-2xl border border-primary-100 -z-10" />
            </div>

            {/* 内容 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <SkeletonBase className="h-5 w-8 rounded" />
                  <div className="w-8 h-px bg-primary-200" />
                  <SkeletonBase className="h-4 w-16 rounded" />
                </div>
                <SkeletonBase className="h-8 w-full rounded" />
                <SkeletonBase className="h-4 w-full rounded" />
                <SkeletonBase className="h-4 w-3/4 rounded" />
                <SkeletonBase className="h-4 w-full rounded" />
              </div>

              <div className="flex gap-10">
                <div>
                  <SkeletonBase className="h-8 w-20 rounded" />
                  <SkeletonBase className="h-4 w-24 rounded mt-1" />
                </div>
                <div>
                  <SkeletonBase className="h-8 w-20 rounded" />
                  <SkeletonBase className="h-4 w-24 rounded mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 企业文化 */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary-200" />
              <SkeletonBase className="h-4 w-24 rounded" />
              <div className="w-8 h-px bg-primary-200" />
            </div>
            <SkeletonBase className="h-8 w-48 mx-auto rounded" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-surface p-8">
                <SkeletonBase className="w-11 h-11 rounded-xl mb-5" />
                <SkeletonBase className="h-4 w-8 rounded mb-2" />
                <SkeletonBase className="h-6 w-24 rounded mb-2" />
                <SkeletonBase className="h-4 w-full rounded" />
                <SkeletonBase className="h-4 w-3/4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 公司信息 */}
      <section className="py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary-200" />
              <SkeletonBase className="h-4 w-24 rounded" />
              <div className="w-8 h-px bg-primary-200" />
            </div>
            <SkeletonBase className="h-8 w-48 mx-auto rounded" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系方式 */}
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-surface-50">
                  <SkeletonBase className="w-10 h-10 rounded-lg flex-shrink-0" />
                  <div>
                    <SkeletonBase className="h-4 w-16 rounded mb-0.5" />
                    <SkeletonBase className="h-5 w-32 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* 地图 */}
            <SkeletonBase className="rounded-2xl h-[360px]" />
          </div>
        </div>
      </section>
    </div>
  )
}

// 联系我们页面骨架
export function ContactPageSkeleton() {
  return (
    <section className="py-28 bg-surface-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* 左：联系信息 */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <SkeletonBase className="h-5 w-8 rounded" />
                <div className="w-8 h-px bg-primary-200" />
                <SkeletonBase className="h-4 w-16 rounded" />
              </div>
              <SkeletonBase className="h-8 w-32 rounded mb-2" />
              <SkeletonBase className="h-4 w-3/4 rounded" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-surface-50">
                  <SkeletonBase className="w-10 h-10 rounded-lg flex-shrink-0" />
                  <div>
                    <SkeletonBase className="h-4 w-16 rounded mb-0.5" />
                    <SkeletonBase className="h-5 w-32 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右：表单 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <SkeletonBase className="h-5 w-8 rounded" />
              <div className="w-8 h-px bg-primary-200" />
              <SkeletonBase className="h-4 w-16 rounded" />
            </div>
            <SkeletonBase className="h-8 w-32 rounded mb-8" />

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <SkeletonBase className="h-4 w-16 rounded mb-1.5" />
                  <SkeletonBase className="h-12 w-full rounded" />
                </div>
                <div>
                  <SkeletonBase className="h-4 w-16 rounded mb-1.5" />
                  <SkeletonBase className="h-12 w-full rounded" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <SkeletonBase className="h-4 w-16 rounded mb-1.5" />
                  <SkeletonBase className="h-12 w-full rounded" />
                </div>
                <div>
                  <SkeletonBase className="h-4 w-16 rounded mb-1.5" />
                  <SkeletonBase className="h-12 w-full rounded" />
                </div>
              </div>

              <div>
                <SkeletonBase className="h-4 w-16 rounded mb-1.5" />
                <SkeletonBase className="h-32 w-full rounded" />
              </div>

              <SkeletonBase className="h-12 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkeletonBase
