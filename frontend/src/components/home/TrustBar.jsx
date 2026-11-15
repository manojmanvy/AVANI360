import { Landmark, Map, ShieldCheck, Users } from 'lucide-react'
import Container from '../ui/Container.jsx'

const items = [
  {
    icon: Users,
    title: 'Owner, broker & builder listings',
    text: 'One marketplace for every seller type',
    iconClass: 'bg-leaf-100 text-leaf-700 border-leaf-200',
  },
  {
    icon: ShieldCheck,
    title: 'Admin verification workflow',
    text: 'Documents reviewed before going live',
    iconClass: 'bg-sage-200 text-sage-800 border-sage-300',
  },
  {
    icon: Map,
    title: 'District-level discovery',
    text: 'Explore all 38 Tamil Nadu districts',
    iconClass: 'bg-beige-200 text-beige-700 border-beige-300',
  },
  {
    icon: Landmark,
    title: 'Free scheme guidance',
    text: 'Information, never a guarantee',
    iconClass: 'bg-leaf-100 text-leaf-700 border-leaf-200',
  },
]

export default function TrustBar() {
  return (
    <section className="border-b border-sage-200/70 bg-gradient-to-r from-sage-100/70 via-beige-100/60 to-sage-100/70">
      <Container className="py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text, iconClass }) => (
            <div key={title} className="flex items-start gap-3.5">
              <span
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border shadow-2xs ${iconClass}`}
              >
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold leading-snug text-navy-950">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-navy-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
