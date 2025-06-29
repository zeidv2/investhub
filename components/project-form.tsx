"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { createProject, updateProject } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/types"

interface ProjectFormProps {
  project?: Project | null
  onSave: (project: Project) => void
  onCancel: () => void
}

/**
 * Project Form Component
 * Form for creating and editing projects
 */
export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    fullDescription: project?.fullDescription || "",
    category: project?.category || "",
    fundingGoal: project?.fundingGoal || 0,
    pricePerShare: project?.pricePerShare || 0,
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Environment",
    "Entertainment",
    "Real Estate",
    "Manufacturing",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      let savedProject: Project

      if (project) {
        // Update existing project
        savedProject = await updateProject(project.id, formData)
      } else {
        // Create new project
        savedProject = await createProject({
          ...formData,
          ownerId: user.uid,
          ownerName: user.displayName || user.email || "Anonymous",
        })
      }

      toast({
        title: project ? "Project Updated" : "Project Created",
        description: `Your project "${formData.title}" has been ${project ? "updated" : "created"} successfully`,
      })

      onSave(savedProject)
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: `Failed to ${project ? "update" : "create"} project`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project title */}
      <div>
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter your project title"
          required
          className="mt-1"
        />
      </div>

      {/* Project category */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Short description */}
      <div>
        <Label htmlFor="description">Short Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Brief description of your project (will be shown in project cards)"
          required
          className="mt-1"
          rows={3}
        />
      </div>

      {/* Full description */}
      <div>
        <Label htmlFor="fullDescription">Full Description</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) => handleInputChange("fullDescription", e.target.value)}
          placeholder="Detailed description of your project, goals, and vision"
          className="mt-1"
          rows={6}
        />
      </div>

      {/* Funding details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fundingGoal">Funding Goal ($) *</Label>
          <Input
            id="fundingGoal"
            type="number"
            min="1"
            value={formData.fundingGoal}
            onChange={(e) => handleInputChange("fundingGoal", Number.parseInt(e.target.value) || 0)}
            placeholder="100000"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="pricePerShare">Price per Share ($) *</Label>
          <Input
            id="pricePerShare"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.pricePerShare}
            onChange={(e) => handleInputChange("pricePerShare", Number.parseFloat(e.target.value) || 0)}
            placeholder="100.00"
            required
            className="mt-1"
          />
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
