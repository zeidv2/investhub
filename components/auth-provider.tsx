"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

/**
 * Auth Provider Component
 * Provides authentication context throughout the app
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    const initAuth = async () => {
      try {
        const { getFirebaseAuth } = await import("@/lib/firebase")
        const { onAuthStateChanged } = await import("firebase/auth")

        const auth = await getFirebaseAuth()

        if (auth) {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
          })
          return unsubscribe
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setLoading(false)
      }
    }

    let unsubscribe: (() => void) | undefined

    initAuth().then((unsub) => {
      unsubscribe = unsub
    })

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
