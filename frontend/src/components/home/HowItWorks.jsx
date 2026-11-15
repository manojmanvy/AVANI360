import { ArrowRight, FileCheck2, Handshake, Map, Search } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

const steps = [
  {
    icon: Search,
    title: 'Search & shortlist',
    text: 'Filter by district, property type, area and budget to find relevant options.',
    iconClass: 'bg-leaf-400/20 text-leaf-200',
  },
  {
    icon: FileCheck2,
    title: 'Verify documents',
    text: 'Our team reviews available documents and listing details before a property goes live.',
    iconClass: 'bg-beige-300/20 text-beige-200',
  },
  {
    icon: Map,
    title: 'Visit the site',
    text: 'Request a site visit and we coordinate a convenient time with the seller.',
    iconClass: 'bg-sage-300/20 text-sage-100',
  },
  {
    icon: Handshake,
    title: 'Close with support',
    text: 'Get guidance on negotiation, registration steps and housing scheme information.',
    iconClass: 'bg-leaf-400/20 text-leaf-200',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-forest py-16 sm:py-20">
      <div className="absolute inset-0 bg-dot-grid opacity-[0.08]" aria-hidden="true" />
      <div
        className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-leaf-400/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-beige-400/15 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-300">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-leaf-400 to-beige-300" aria-hidden="true" />
              How BookMyLand works
            </span>
            <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              A calmer way to buy land in Tamil Nadu
            </h2>
            <p className="mt-3 text-balance text-base leading-relaxed text-white/60">
              Our team stays involved beyond the listing. Search, verify, visit and close with clarity
              at every step.
            </p>
          </div>
          <Button to="/properties" variant="light" size="md" className="flex-shrink-0">
            Explore properties <ArrowRight size={16} />
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition-colors hover:border-leaf-400/40 hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.iconClass}`}>
                  <step.icon size={20} />
                </span>
                <span className="text-xs font-bold tracking-[0.2em] text-white/25">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
