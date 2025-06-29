"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/auth-provider"

/**
 * Authentication Hook
 * Provides authentication methods and user state management
 */
export function useAuth() {
  const { user, loading } = useAuthContext()
  const [userRole, setUserRole] = useState<"investor" | "owner" | null>(null)

  useEffect(() => {
    console.log("Current user in useAuth:", user);

    const fetchUserRole = async () => {
      if (user && typeof window !== "undefined") {
        try {
          const { getFirebaseDb } = await import("@/lib/firebase")
          const { doc, getDoc } = await import("firebase/firestore")

          const db = await getFirebaseDb()
          if (db) {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            if (userDoc.exists()) {
              const fetchedRole = userDoc.data().role
              console.log("Fetched user role:", fetchedRole)
              setUserRole(fetchedRole)
            } else {
              console.warn("User document does not exist in Firestore")
              setUserRole(null)
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
    }

    fetchUserRole()
  }, [user])

  const login = async (email: string, password: string) => {
    if (typeof window === "undefined") {
      throw new Error("Login can only be performed on the client side")
    }

    try {
      const { getFirebaseAuth } = await import("@/lib/firebase")
      const { signInWithEmailAndPassword } = await import("firebase/auth")

      const auth = await getFirebaseAuth()
      if (!auth) throw new Error("Auth service not available")

      if (!auth.app || !auth.app.options) {
        throw new Error("Firebase app not initialized correctly")
      }

      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login successful, user:", result.user)
      return result.user
    } catch (error) {
      console.error("Error during login:", error)
      throw error
    }
  }

  const signup = async (email: string, password: string, role: "investor" | "owner", displayName: string) => {
    if (typeof window === "undefined") {
      throw new Error("Signup can only be performed on the client side")
    }

    try {
      const { getFirebaseAuth, getFirebaseDb } = await import("@/lib/firebase")
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
      const { doc, setDoc } = await import("firebase/firestore")

      const auth = await getFirebaseAuth()
      const db = await getFirebaseDb()

      if (!auth || !db) throw new Error("Firebase services not available")

      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user

      await updateProfile(user, { displayName })

      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName,
          role,
          createdAt: new Date().toISOString(),
        })
        console.log("User document added successfully in Firestore!")
      } catch (error) {
        console.error("Error saving user document to Firestore:", error)
        throw error
      }

      setUserRole(role)

      // بعد التسجيل الناجح وجه المستخدم للصفحة الرئيسية
      window.location.href = "/"

      return user
    } catch (error) {
      console.error("Error during signup:", error)
      throw error
    }
  }

  const logout = async () => {
    if (typeof window === "undefined") {
      throw new Error("Logout can only be performed on the client side")
    }

    try {
      const { getFirebaseAuth } = await import("@/lib/firebase")
      const { signOut } = await import("firebase/auth")

      const auth = await getFirebaseAuth()
      if (!auth) throw new Error("Auth service not available")

      await signOut(auth)
      setUserRole(null)
      console.log("User logged out successfully")
    } catch (error) {
      console.error("Error during logout:", error)
      throw error
    }
  }

  return {
    user,
    userRole,
    loading,
    login,
    signup,
    logout,
  }
}
