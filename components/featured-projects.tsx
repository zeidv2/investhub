"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getProjects } from "@/lib/firebase"
import type { Project } from "@/types"

/**
 * Featured Projects Component
 * Showcases highlighted projects on the homepage
 */
export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects()
        // Show only first 3 projects as featured
        setProjects(allProjects.slice(0, 3))
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">المشاريع المميزة</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">المشاريع المميزة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اكتشف بعضًا من أبرز فرص الاستثمار لدينا
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => {
            const fundingProgress = (project.currentFunding / project.fundingGoal) * 100

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Funding progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>التقدم في التمويل</span>
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

        {/* View all projects link */}
        <div className="text-center">
          <Link href="/projects">
            <Button variant="outline" size="lg">
              عرض جميع المشاريع
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}