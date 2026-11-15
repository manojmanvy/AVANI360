import { ArrowRight, Building2, CheckCircle2, Handshake, Home } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

const roles = [
  {
    icon: Home,
    title: 'Property owners',
    text: 'List your land or home directly, with our team handling buyer enquiries.',
    iconClass: 'bg-leaf-100 text-leaf-700',
  },
  {
    icon: Handshake,
    title: 'Brokers & agents',
    text: 'Publish multiple listings and track interest from one dashboard.',
    iconClass: 'bg-sage-200 text-sage-800',
  },
  {
    icon: Building2,
    title: 'Builders & developers',
    text: 'Showcase projects with documents, amenities and location context.',
    iconClass: 'bg-beige-200 text-beige-700',
  },
]

const points = [
  'Free listing review by our team',
  'Manage enquiries and site visits in one place',
  'Clear approval status from pending to live',
]

export default function SellerCTA() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <Container>
        <div className="bg-clay relative overflow-hidden rounded-[2rem] border border-sage-200 px-6 py-10 shadow-soft sm:px-10 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-dot-grid opacity-[0.35]" aria-hidden="true" />
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-leaf-300/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-beige-300/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-leaf-800 ring-1 ring-inset ring-sage-300">
                For owners, brokers & builders
              </span>
              <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
                Have land or a property to sell?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-navy-600">
                List with BookMyLand and reach buyers who are actively searching across Tamil Nadu.
                We help with enquiries, site visits and the next steps.
              </p>

              <ul className="mt-6 space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-navy-700">
                    <CheckCircle2 size={17} className="flex-shrink-0 text-leaf-600" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/list-property" variant="primary" size="lg">
                  List a property <ArrowRight size={17} />
                </Button>
                <Button
                  to="/#how-it-works"
                  variant="outline"
                  size="lg"
                >
                  How it works
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {roles.map(({ icon: Icon, title, text, iconClass }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-sage-200 bg-white/80 p-5 backdrop-blur"
                >
                  <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-navy-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
