import usePageTitle from '../hooks/usePageTitle.js'
import Hero from '../components/home/Hero.jsx'
import TrustBar from '../components/home/TrustBar.jsx'
import CategoryGrid from '../components/home/CategoryGrid.jsx'
import FeaturedProperties from '../components/home/FeaturedProperties.jsx'
import LocationDiscovery from '../components/home/LocationDiscovery.jsx'
import AboutSection from '../components/home/AboutSection.jsx'
import HowItWorks from '../components/home/HowItWorks.jsx'
import SchemeSection from '../components/home/SchemeSection.jsx'
import SellerCTA from '../components/home/SellerCTA.jsx'

export default function HomePage() {
  usePageTitle('Tamil Nadu Land & Property Marketplace')

  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProperties />
      <LocationDiscovery />
      <AboutSection />
      <HowItWorks />
      <SchemeSection />
      <SellerCTA />
    </>
  )
}
