import { CheckCircle2 } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Logo from '../layout/Logo.jsx'

const points = [
  'Verified listing workflow before properties go live',
  'Local support across all Tamil Nadu districts',
  'Free, honest guidance for government housing schemes',
]

export default function AuthShell({ children }) {
  return (
    <section className="bg-cream py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-sage-200 bg-white shadow-card">
          <div className="grid lg:grid-cols-2">
            <div className="relative hidden min-h-[36rem] lg:block">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
                alt="Modern home used as a sample AVANI360 visual"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-leaf-950/95 via-sage-950/90 to-leaf-900/85" />

              <div className="relative flex h-full flex-col justify-between p-10 text-white">
                <Logo light />

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-300">
                    Buy with confidence
                  </p>
                  <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight">
                    Land decisions feel safer with local support.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    AVANI360 brings listings, document checks and scheme guidance into one place,
                    with a team that knows Tamil Nadu.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-white/75">
                        <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-leaf-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mx-auto max-w-md">{children}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
