import { Compass } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'

export default function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <section className="bg-cream">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-navy-700 shadow-soft">
          <Compass size={30} />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">404</p>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          This page hasn&apos;t been listed yet
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-600">
          The page you are looking for does not exist or has moved. Head back home or explore the
          live property listings.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/" variant="navy" size="md">
            Back to home
          </Button>
          <Button to="/properties" variant="outline" size="md">
            Browse properties
          </Button>
        </div>
      </Container>
    </section>
  )
}
