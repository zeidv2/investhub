"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { getUserProjects, deleteProject } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/types"
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Users, Eye } from "lucide-react"
import { ProjectForm } from "./project-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

/**
 * Owner Dashboard Component
 * Project management interface for project owners (CRUD operations)
 */
export function OwnerDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        const userProjects = await getUserProjects(user.uid)
        setProjects(userProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      setProjects(projects.filter((p) => p.id !== projectId))
      toast({
        title: "تم حذف المشروع",
        description: "تم حذف مشروعك بنجاح",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "خطأ",
        description: "تعذر حذف المشروع",
        variant: "destructive",
      })
    }
  }

  const handleProjectSaved = (savedProject: Project) => {
    if (editingProject) {
      // Update existing project
      setProjects(projects.map((p) => (p.id === savedProject.id ? savedProject : p)))
    } else {
      // Add new project
      setProjects([savedProject, ...projects])
    }
    setEditingProject(null)
    setShowCreateForm(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading skeleton for projects */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate dashboard statistics
  const totalFundingGoal = projects.reduce((sum, p) => sum + p.fundingGoal, 0)
  const totalFundingRaised = projects.reduce((sum, p) => sum + p.currentFunding, 0)
  const totalInvestors = projects.reduce((sum, p) => sum + (p.investors?.length || 0), 0)

  return (
    <div className="space-y-6">
      {/* Dashboard statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المشاريع</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الأموال المجمعة</p>
                <p className="text-2xl font-bold">${totalFundingRaised.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المستثمرين</p>
                <p className="text-2xl font-bold">{totalInvestors}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>مشاريعك</CardTitle>
              <CardDescription>إدارة مشاريعك الاستثمارية وتتبع الأداء</CardDescription>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  أنشئ مشروع
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>إنشاء مشروع جديد</DialogTitle>
                  <DialogDescription>أدخل تفاصيل مشروعك الاستثماري الجديد</DialogDescription>
                </DialogHeader>
                <ProjectForm onSave={handleProjectSaved} onCancel={() => setShowCreateForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">لم تقم بإنشاء أي مشروع بعد</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                أنشئ أول مشروع لك
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const fundingProgress = (project.currentFunding / project.fundingGoal) * 100

                return (
                  <div key={project.id} className="border rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                        {/* Funding progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>التقدم في التمويل</span>
                            <span>{Math.round(fundingProgress)}%</span>
                          </div>
                          <Progress value={fundingProgress} className="h-2" />
                        </div>

                        {/* Project stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">الهدف</p>
                            <p className="font-semibold">${project.fundingGoal.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">تم جمعه</p>
                            <p className="font-semibold">${project.currentFunding.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">سعر السهم</p>
                            <p className="font-semibold">${project.pricePerShare}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المستثمرون</p>
                            <p className="font-semibold">{project.investors?.length || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            تفاصيل
                          </Button>
                        </Link>

                        <Dialog
                          open={editingProject?.id === project.id}
                          onOpenChange={(open) => {
                            if (!open) setEditingProject(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                              <Edit className="mr-2 h-4 w-4" />
                              تعديل
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>تعديل المشروع</DialogTitle>
                              <DialogDescription>قم بتحديث بيانات مشروعك</DialogDescription>
                            </DialogHeader>
                            <ProjectForm
                              project={editingProject}
                              onSave={handleProjectSaved}
                              onCancel={() => setEditingProject(null)}
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              حذف
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>حذف المشروع</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد أنك تريد حذف "{project.title}"؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}