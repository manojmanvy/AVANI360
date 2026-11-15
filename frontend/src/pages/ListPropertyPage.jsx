import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  FileText,
  Handshake,
  Home,
  IndianRupee,
  MapPin,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const sellerPoints = [
  'Free listing review by our team',
  'Buyer enquiries and site visits in one dashboard',
  'Clear approval status from pending to live',
]

const roles = [
  {
    icon: Home,
    title: 'Property owners',
    text: 'List your own land, home or farm directly. We help you present it clearly and handle buyer questions.',
    iconClass: 'bg-leaf-100 text-leaf-700',
  },
  {
    icon: Handshake,
    title: 'Brokers & agents',
    text: 'Manage multiple client listings, track interest and coordinate site visits from one place.',
    iconClass: 'bg-sage-200 text-sage-800',
  },
  {
    icon: Building2,
    title: 'Builders & developers',
    text: 'Publish projects with amenities, documents and location context that buyers actually need.',
    iconClass: 'bg-beige-200 text-beige-700',
  },
]

const features = [
  { icon: FileText, title: 'Property details', text: 'Title, description, price, area and dimensions.' },
  { icon: Camera, title: 'Multiple photos', text: 'Upload a gallery so buyers can preview the property.' },
  { icon: MapPin, title: 'Map location', text: 'Add a Google Maps link so buyers can view the plot location.' },
  { icon: ShieldCheck, title: 'Documents', text: 'List available documents like Patta, Chitta and EC.' },
  { icon: IndianRupee, title: 'Pricing', text: 'Set a clear asking price and budget expectations.' },
  { icon: CalendarDays, title: 'Enquiries & visits', text: 'Receive buyer enquiries and site visit requests.' },
]

const steps = [
  {
    icon: UserRound,
    title: 'Create a seller account',
    text: 'Register as an owner, broker or builder and choose the role that fits you.',
  },
  {
    icon: FileText,
    title: 'Add property details',
    text: 'Enter the title, price, area, district, locality, dimensions and documents.',
  },
  {
    icon: Camera,
    title: 'Upload photos & location',
    text: 'Add a photo gallery and a Google Maps link for the property location.',
  },
  {
    icon: ShieldCheck,
    title: 'Go live after review',
    text: 'Our admin team reviews the listing and updates the approval status.',
  },
]

const faqs = [
  {
    question: 'Is listing my property free?',
    answer:
      'Creating a seller account and submitting a listing is free. Our team reviews every listing before it goes live. Paid plans and featured promotions will be introduced later.',
  },
  {
    question: 'Who can list on BookMyLand?',
    answer:
      'Individual property owners, registered brokers and agents, and builders or developers can all create seller accounts. Each role gets a matching dashboard.',
  },
  {
    question: 'Do you guarantee a sale?',
    answer:
      'No. We support discovery, enquiries, site visits and next-step guidance. A sale depends on price, documents, location and genuine buyer interest.',
  },
  {
    question: 'How are listings approved?',
    answer:
      'Every listing moves through a review workflow. Our admin team checks the details and available documents before a property appears as live inventory.',
  },
]

export default function ListPropertyPage() {
  usePageTitle('List your property')

  return (
    <section className="bg-cream">
      <div className="relative overflow-hidden border-b border-sage-200 bg-gradient-to-br from-cream via-beige-100 to-sage-100">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden="true" />
        <div className="absolute inset-0 bg-dot-grid opacity-40" aria-hidden="true" />

        <Container className="relative py-14 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Badge variant="green" className="bg-white/90">
                <Home size={13} /> List with BookMyLand
              </Badge>
              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-950 sm:text-5xl">
                Sell your land with a team that handles the details.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-600">
                Create a listing, showcase your documents and receive buyer enquiries. Our team
                supports you from the first site visit to the final registration steps.
              </p>

              <ul className="mt-6 space-y-2.5">
                {sellerPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-navy-700">
                    <CheckCircle2 size={17} className="flex-shrink-0 text-leaf-600" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/seller" size="lg">
                  Start listing <ArrowRight size={17} />
                </Button>
                <Button to="/properties" variant="outline" size="lg">
                  See buyer view
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-float ring-1 ring-sage-200">
                <div className="relative aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern home listed by a BookMyLand seller"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sage-950/70 via-sage-950/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Seller preview
                    </p>
                    <p className="mt-1 text-sm font-bold">Owner · Broker · Builder</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-3 w-60 rounded-2xl border border-sage-200 bg-white/95 p-4 shadow-float backdrop-blur sm:-left-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-navy-400">
                  Listing status
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-beige-400" />
                  <span className="text-xs font-semibold text-navy-700">Pending review</span>
                </div>
                <div className="my-2 ml-1 h-4 w-px bg-sage-200" />
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-leaf-500" />
                  <span className="text-xs font-semibold text-navy-700">Approved & live</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who can list"
            title="One platform, three seller journeys"
            description="Every seller type gets a focused dashboard, while buyers see one consistent, trustworthy listing experience."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {roles.map(({ icon: Icon, title, text, iconClass }) => (
              <div
                key={title}
                className="rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-card"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div className="bg-clay py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Listing tools"
            title="What you can add to a listing"
            description="Give buyers the details they need to shortlist with confidence."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-sage-200 bg-white p-5"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100 text-leaf-700">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-navy-900">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-navy-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="From account to approved listing"
            description="Four clear steps, with review and approval handled by our admin team."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-sage-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                    <step.icon size={20} />
                  </span>
                  <span className="text-xs font-bold tracking-[0.2em] text-sage-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div className="pb-16 sm:pb-20">
        <Container>
          <div className="grid gap-10 rounded-[2rem] border border-sage-200 bg-white p-6 shadow-soft sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
                Questions sellers ask
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                Straight answers about the seller journey. No guarantees, no hidden promises.
              </p>
              <div className="mt-6 rounded-2xl bg-sage-100/70 p-5">
                <p className="text-sm font-semibold text-navy-800">Need a person instead?</p>
                <p className="mt-1 text-xs leading-relaxed text-navy-500">
                  Our team can walk you through the listing process and the documents you will need.
                </p>
                <Link
                  to="/#contact"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-leaf-700 underline-offset-4 hover:underline"
                >
                  Contact the team <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-sage-200 bg-white px-4 py-3 open:border-leaf-200 open:bg-leaf-50/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-navy-900 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown
                      size={17}
                      className="flex-shrink-0 text-navy-400 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className="pb-16 sm:pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="absolute inset-0 bg-dot-grid opacity-[0.07]" aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white">
                Ready to list your property?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Start with a seller account, add your property details, photos and location, and our
                team will review your listing for approval.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button to="/register?role=owner" size="lg">
                  Create seller account <ArrowRight size={17} />
                </Button>
                <Button
                  to="/register?role=broker"
                  variant="ghost"
                  size="lg"
                  className="border border-white/25 text-white hover:bg-white/10"
                >
                  I am a broker
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
