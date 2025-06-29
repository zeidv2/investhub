/**
 * Type Definitions
 * Central location for all TypeScript interfaces and types
 */

export interface Project {
  id: string
  title: string
  description: string
  fullDescription?: string
  category: string
  fundingGoal: number
  currentFunding: number
  pricePerShare: number
  ownerId: string
  ownerName: string
  createdAt: string
  investors?: string[]
}

export interface Investment {
  id: string
  projectId: string
  projectTitle: string
  projectCategory: string
  investorId: string
  shares: number
  pricePerShare: number
  totalAmount: number
  createdAt: string
}

export interface User {
  id: string
  email: string
  displayName: string
  role: "investor" | "owner"
  createdAt: string
}
