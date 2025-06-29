"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "investor" | "owner"
}

/**
 * Protected Route Component
 * Ensures user is authenticated and has the required role
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (requiredRole && userRole !== requiredRole) {
        router.push("/")
        return
      }
    }
  }, [user, userRole, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (requiredRole && userRole !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
