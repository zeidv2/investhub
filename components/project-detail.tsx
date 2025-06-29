"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { getProject, investInProject } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/types"
import { ArrowLeft, Calendar, Target, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface ProjectDetailProps {
  projectId: string
}

/**
 * Project Detail Component
 * Comprehensive view of a single project with investment functionality
 */
export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)
  const [shareAmount, setShareAmount] = useState(1)
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProject(projectId)
        setProject(projectData)
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "خطأ",
          description: "تعذر تحميل تفاصيل المشروع",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, toast])

  const handleInvestment = async () => {
    if (!user || !project || userRole !== "investor") {
      toast({
        title: "مطلوب تسجيل الدخول",
        description: "يرجى تسجيل الدخول كمستثمر للاستثمار في المشاريع",
        variant: "destructive",
      })
      return
    }

    setInvesting(true)
    try {
      await investInProject(projectId, user.uid, shareAmount, project.pricePerShare)

      toast({
        title: "تم الاستثمار بنجاح!",
        description: `تم استثمار ${shareAmount} سهم في مشروع ${project.title}`,
      })

      // Refresh project data
      const updatedProject = await getProject(projectId)
      setProject(updatedProject)
      setShareAmount(1)
    } catch (error) {
      console.error("Investment error:", error)
      toast({
        title: "فشل الاستثمار",
        description: "حدث خطأ أثناء معالجة الاستثمار",
        variant: "destructive",
      })
    } finally {
      setInvesting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">المشروع غير موجود</p>
        <Link href="/projects">
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            عودة للمشاريع
          </Button>
        </Link>
      </div>
    )
  }

  const fundingProgress = (project.currentFunding / project.fundingGoal) * 100
  const totalInvestment = shareAmount * project.pricePerShare

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/projects">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          عودة للمشاريع
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{project.category}</Badge>
                    <span className="text-sm text-muted-foreground">بواسطة {project.ownerName}</span>
                  </div>
                </div>
              </div>
              <CardDescription className="text-base">{project.description}</CardDescription>
            </CardHeader>
          </Card>

          {/* Funding progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                التقدم في التمويل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>التقدم</span>
                    <span>{Math.round(fundingProgress)}%</span>
                  </div>
                  <Progress value={fundingProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">${project.currentFunding.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">تم جمعه</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${project.fundingGoal.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">الهدف</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{project.investors?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">عدد المستثمرين</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project details */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل المشروع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">سعر السهم</p>
                    <p className="text-lg font-bold">${project.pricePerShare}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">تاريخ الإنشاء</p>
                    <p className="text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">الوصف الكامل</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {project.fullDescription || project.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                استثمر الآن
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && userRole === "investor" ? (
                <>
                  <div>
                    <Label htmlFor="shares">عدد الأسهم</Label>
                    <Input
                      id="shares"
                      type="number"
                      min="1"
                      value={shareAmount}
                      onChange={(e) => setShareAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>إجمالي الاستثمار:</span>
                      <span className="text-lg font-bold">${totalInvestment.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button onClick={handleInvestment} disabled={investing} className="w-full" size="lg">
                    {investing ? "جاري المعالجة..." : "استثمر الآن"}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    {!user ? "يرجى تسجيل الدخول للاستثمار في هذا المشروع" : "فقط المستثمرين يمكنهم الاستثمار في المشاريع"}
                  </p>
                  {!user && (
                    <div className="space-y-2">
                      <Link href="/auth/login">
                        <Button className="w-full">دخول</Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button variant="outline" className="w-full bg-transparent">
                          سجل كمستثمر
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project stats */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المشروع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">هدف التمويل</span>
                <span className="font-medium">${project.fundingGoal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">التمويل الحالي</span>
                <span className="font-medium">${project.currentFunding.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المتبقي</span>
                <span className="font-medium">${(project.fundingGoal - project.currentFunding).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">عدد المستثمرين</span>
                <span className="font-medium">{project.investors?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}