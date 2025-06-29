import { Navbar } from "@/components/navbar"
import { ProjectsGrid } from "@/components/projects-grid"
import { Footer } from "@/components/footer"

/**
 * Projects Marketplace Page
 * Displays all available projects in a grid layout for browsing
 */
export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Investment Opportunities</h1>
          <p className="text-muted-foreground">Discover innovative projects seeking funding from investors like you</p>
        </div>

        {/* Grid of all available projects */}
        <ProjectsGrid />
      </main>
      <Footer />
    </div>
  )
}
