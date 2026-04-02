interface PageHeaderProps {
  number?: string
  label: string
  title: string
  description: string
}

export default function PageHeader({ number, label, title, description }: PageHeaderProps) {
  return (
    <section className="pt-32 pb-20 bg-surface-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative text-center">
        {/* 标签 */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {number && (
            <>
              <span className="font-display text-sm font-bold text-primary-600 tracking-wider">{number}</span>
              <div className="w-8 h-px bg-primary-200" />
            </>
          )}
          <span className="text-xs font-semibold text-primary-600 tracking-widest uppercase">{label}</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-surface-900 tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg text-surface-500 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  )
}
