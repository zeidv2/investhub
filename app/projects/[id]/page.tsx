import { Navbar } from "@/components/navbar"
import { ProjectDetail } from "@/components/project-detail"
import { Footer } from "@/components/footer"

/**
 * Individual Project Detail Page
 * Shows comprehensive information about a specific project
 * Includes funding details and investment options
 */
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Detailed project information and investment interface */}
        <ProjectDetail projectId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
