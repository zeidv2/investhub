"use client"

import { initializeApp, getApps, getApp } from "firebase/app"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvqQ_L5hYkV9bUaWGRqVswvYFVELoLN60",
  authDomain: "investhup-b9a2c.firebaseapp.com",
  projectId: "investhup-b9a2c",
  storageBucket: "investhup-b9a2c.appspot.com", 
  messagingSenderId: "827772456439",
  appId: "1:827772456439:web:8a939cd78725c8a482b2f2",
}

// Initialize Firebase app (singleton pattern)
let firebaseApp = null

if (typeof window !== "undefined") {
  // Only initialize on client side
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
}

// Client-side only Firebase service instances
let authInstance = null
let dbInstance = null

// Lazy initialization functions that only run on client side
export const getFirebaseAuth = async () => {
  if (typeof window === "undefined") return null

  if (!authInstance && firebaseApp) {
    const { getAuth } = await import("firebase/auth")
    authInstance = getAuth(firebaseApp)
  }
  return authInstance
}

export const getFirebaseDb = async () => {
  if (typeof window === "undefined") return null

  if (!dbInstance && firebaseApp) {
    const { getFirestore } = await import("firebase/firestore")
    dbInstance = getFirestore(firebaseApp)
  }
  return dbInstance
}

// Initialize services immediately for synchronous access
let auth = null
let db = null

if (typeof window !== "undefined") {
  // Initialize auth and db for synchronous access
  getFirebaseAuth().then((authService) => {
    auth = authService
  })

  getFirebaseDb().then((dbService) => {
    db = dbService
  })
}

// Export instances (will be null on server side)
export { auth, db, firebaseApp }

// Project operations with client-side safety
export const createProject = async (projectData) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { collection, addDoc } = await import("firebase/firestore")

  try {
    const docRef = await addDoc(collection(firestore, "projects"), {
      ...projectData,
      createdAt: new Date().toISOString(),
      currentFunding: 0,
      investors: [],
    })

    return {
      id: docRef.id,
      ...projectData,
      createdAt: new Date().toISOString(),
      currentFunding: 0,
      investors: [],
    }
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export const getProjects = async () => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { collection, getDocs, query, orderBy } = await import("firebase/firestore")

  try {
    const querySnapshot = await getDocs(query(collection(firestore, "projects"), orderBy("createdAt", "desc")))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

export const getProject = async (projectId) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { doc, getDoc } = await import("firebase/firestore")

  try {
    const docSnap = await getDoc(doc(firestore, "projects", projectId))
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching project:", error)
    throw error
  }
}

export const updateProject = async (projectId, updates) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { doc, updateDoc, getDoc } = await import("firebase/firestore")

  try {
    const projectRef = doc(firestore, "projects", projectId)
    await updateDoc(projectRef, updates)

    const updatedDoc = await getDoc(projectRef)
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    }
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export const deleteProject = async (projectId) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { doc, deleteDoc } = await import("firebase/firestore")

  try {
    await deleteDoc(doc(firestore, "projects", projectId))
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

export const getUserProjects = async (userId) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

  try {
    const q = query(collection(firestore, "projects"), where("ownerId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching user projects:", error)
    throw error
  }
}

export const investInProject = async (projectId, investorId, shares, pricePerShare) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { collection, addDoc, doc, updateDoc, increment } = await import("firebase/firestore")

  try {
    const totalAmount = shares * pricePerShare

    const investmentData = {
      projectId,
      investorId,
      shares,
      pricePerShare,
      totalAmount,
      createdAt: new Date().toISOString(),
    }

    await addDoc(collection(firestore, "investments"), investmentData)

    const projectRef = doc(firestore, "projects", projectId)
    await updateDoc(projectRef, {
      currentFunding: increment(totalAmount),
      investors: increment(1),
    })
  } catch (error) {
    console.error("Error processing investment:", error)
    throw error
  }
}

export const getUserInvestments = async (userId) => {
  if (typeof window === "undefined") {
    throw new Error("This operation can only be performed on the client side")
  }

  const firestore = await getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  const { collection, query, where, orderBy, getDocs, doc, getDoc } = await import("firebase/firestore")

  try {
    const q = query(
      collection(firestore, "investments"),
      where("investorId", "==", userId),
      orderBy("createdAt", "desc"),
    )
    const querySnapshot = await getDocs(q)

    const investments = await Promise.all(
      querySnapshot.docs.map(async (investmentDoc) => {
        const investmentData = investmentDoc.data()

        const projectDoc = await getDoc(doc(firestore, "projects", investmentData.projectId))
        const projectData = projectDoc.data()

        return {
          id: investmentDoc.id,
          ...investmentData,
          projectTitle: projectData?.title || "Unknown Project",
          projectCategory: projectData?.category || "Unknown",
        }
      }),
    )

    return investments
  } catch (error) {
    console.error("Error fetching user investments:", error)
    throw error
  }
}
