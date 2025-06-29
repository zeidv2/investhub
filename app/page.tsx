import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProjects } from "@/components/featured-projects"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

/**
 * Homepage Component
 * Main landing page that introduces the platform and showcases featured projects
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero section with platform introduction */}
        <Hero />

        {/* Featured projects showcase */}
        <FeaturedProjects />

        {/* Platform features explanation */}
        <Features />
      </main>
      <Footer />
    </div>
  )
}
