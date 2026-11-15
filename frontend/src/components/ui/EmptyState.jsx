import { SearchX } from 'lucide-react'

export default function EmptyState({ title, description, action, icon: Icon = SearchX }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-500">
        <Icon size={26} />
      </span>
      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-navy-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
