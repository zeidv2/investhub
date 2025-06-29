"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search } from "lucide-react"
import { getProjects } from "@/lib/firebase"
import type { Project } from "@/types"

/**
 * Projects Grid Component
 * Displays all projects with search and filter functionality
 */
export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects()
        setProjects(allProjects)
        setFilteredProjects(allProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search and category
  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((project) => project.category === categoryFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, categoryFilter])

  const categories = [...new Set(projects.map((p) => p.category))]

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-muted rounded w-full sm:w-80 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-full sm:w-48 animate-pulse"></div>
        </div>

        {/* Loading skeleton for grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="ابحث عن مشروع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="تصفية حسب الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const fundingProgress = (project.currentFunding / project.fundingGoal) * 100

          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                  <Badge variant="secondary">{project.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Funding progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>التقدم</span>
                      <span>{Math.round(fundingProgress)}%</span>
                    </div>
                    <Progress value={fundingProgress} className="h-2" />
                  </div>

                  {/* Project stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">الهدف</p>
                      <p className="font-semibold">${project.fundingGoal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">سعر السهم</p>
                      <p className="font-semibold">${project.pricePerShare}</p>
                    </div>
                  </div>

                  <Link href={`/projects/${project.id}`}>
                    <Button className="w-full">تفاصيل المشروع</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No results message */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد مشاريع مطابقة للبحث أو الفئة.</p>
        </div>
      )}
    </div>
  )
}