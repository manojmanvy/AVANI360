import { ArrowRight, Handshake, Map, ShieldCheck } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

const pillars = [
  {
    icon: Map,
    title: 'District-level context',
    text: 'Discovery built around Tamil Nadu districts, not just vague city filters.',
    iconClass: 'bg-sage-200 text-sage-800',
  },
  {
    icon: Handshake,
    title: 'Human support',
    text: 'Our team coordinates enquiries, site visits and the next steps with you.',
    iconClass: 'bg-leaf-100 text-leaf-700',
  },
  {
    icon: ShieldCheck,
    title: 'Honest guidance',
    text: 'Clear document expectations and scheme information, with no false guarantees.',
    iconClass: 'bg-beige-200 text-beige-700',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-cream py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-float ring-1 ring-sage-200">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                alt="Open land in Tamil Nadu used as a sample BookMyLand visual"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950/60 via-sage-900/10 to-transparent" />
            </div>

            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-sage-200 bg-white/95 px-4 py-3 shadow-float backdrop-blur sm:left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                <Map size={19} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-navy-900">38 districts</p>
                <p className="text-[11px] text-navy-500">One Tamil Nadu marketplace</p>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-600">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-leaf-500 to-beige-400" aria-hidden="true" />
              Greenyas Consultancy Services presents
            </span>
            <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Land buying in Tamil Nadu deserves local context.
            </h2>
            <p className="mt-3 text-balance text-base leading-relaxed text-navy-600">
              A listing alone is not enough. Buyers need to understand the district, the documents
              and the people behind the property. BookMyLand brings all three together.
            </p>

            <div className="mt-7 space-y-5">
              {pillars.map(({ icon: Icon, title, text, iconClass }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button to="/#how-it-works" variant="navy" size="md" className="mt-8">
              See how it works <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
