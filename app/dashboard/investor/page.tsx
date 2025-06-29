import { Navbar } from "@/components/navbar"
import { InvestorDashboard } from "@/components/investor-dashboard"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"

/**
 * Investor Dashboard Page
 * Protected route showing investor's portfolio and owned shares
 */
export default function InvestorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="investor">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Investor Dashboard</h1>
          {/* Portfolio overview and investment tracking */}
          <InvestorDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
