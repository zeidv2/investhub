import { Navbar } from "@/components/navbar"
import { OwnerDashboard } from "@/components/owner-dashboard"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"

/**
 * Project Owner Dashboard Page
 * Protected route for managing projects (CRUD operations)
 */
export default function OwnerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="owner">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Project Owner Dashboard</h1>
          {/* Project management interface */}
          <OwnerDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
