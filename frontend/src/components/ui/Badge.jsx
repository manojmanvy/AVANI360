const variants = {
  green: 'bg-leaf-50 text-leaf-800 ring-1 ring-inset ring-leaf-200',
  sage: 'bg-sage-100 text-sage-900 ring-1 ring-inset ring-sage-300',
  navy: 'bg-sage-100 text-sage-900 ring-1 ring-inset ring-sage-300',
  beige: 'bg-beige-100 text-beige-800 ring-1 ring-inset ring-beige-300',
  amber: 'bg-beige-100 text-beige-800 ring-1 ring-inset ring-beige-300',
  white: 'bg-white/95 text-navy-800 shadow-sm ring-1 ring-inset ring-sage-200',
  dark: 'bg-forest text-white backdrop-blur',
}

export default function Badge({ variant = 'green', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        variants[variant] || variants.green
      } ${className}`}
    >
      {children}
    </span>
  )
}
