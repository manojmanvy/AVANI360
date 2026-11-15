import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60'

const variants = {
  primary:
    'bg-gradient-to-r from-leaf-700 via-leaf-600 to-leaf-500 text-white shadow-soft hover:-translate-y-0.5 hover:shadow-glow',
  navy: 'bg-gradient-to-r from-sage-800 to-leaf-800 text-white shadow-soft hover:-translate-y-0.5 hover:from-sage-700 hover:to-leaf-700 hover:shadow-glow',
  outline:
    'border border-sage-300 bg-white/80 text-navy-900 hover:border-leaf-400 hover:bg-leaf-50',
  ghost: 'text-navy-700 hover:bg-sage-100',
  light: 'bg-white text-leaf-800 shadow-soft hover:-translate-y-0.5 hover:bg-beige-50',
  warm: 'bg-gradient-to-r from-beige-500 to-beige-400 text-navy-950 shadow-soft hover:-translate-y-0.5 hover:shadow-glow-warm',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
