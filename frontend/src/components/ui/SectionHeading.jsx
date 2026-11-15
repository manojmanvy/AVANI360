export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  actions,
  className = '',
}) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'

  return (
    <div
      className={`flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-600">
            <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-leaf-500 to-beige-400" aria-hidden="true" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-balance text-base leading-relaxed text-navy-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  )
}
