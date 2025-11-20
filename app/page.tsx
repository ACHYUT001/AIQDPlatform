import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { ProductDetails } from '@/components/landing/ProductDetails'
import { StatsAndTestimonials } from '@/components/landing/StatsAndTestimonials'
import { Contact } from '@/components/landing/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-blue-500/30">
      <Header />
      <Hero />
      <ProductDetails />
      <StatsAndTestimonials />
      <Contact />
      <Footer />
    </main>
  )
}
