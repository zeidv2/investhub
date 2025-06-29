"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { getUserInvestments } from "@/lib/firebase"
import type { Investment } from "@/types"
import { TrendingUp, DollarSign, PieChart, Activity } from "lucide-react"
import Link from "next/link"

/**
 * Investor Dashboard Component
 * Shows portfolio overview and investment tracking for investors
 */
export function InvestorDashboard() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return

      try {
        const userInvestments = await getUserInvestments(user.uid)
        setInvestments(userInvestments)
      } catch (error) {
        console.error("Error fetching investments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestments()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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

        {/* Loading skeleton for investments */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate portfolio statistics
  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalShares = investments.reduce((sum, inv) => sum + inv.shares, 0)
  const uniqueProjects = new Set(investments.map((inv) => inv.projectId)).size

  // Simulate portfolio value (in real app, this would be calculated based on current project valuations)
  const portfolioValue = totalInvested * 1.15 // Simulated 15% growth
  const portfolioGrowth = totalInvested > 0 ? ((portfolioValue - totalInvested) / totalInvested) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Portfolio overview stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الاستثمار</p>
                <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">قيمة المحفظة</p>
                <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">العائد الكلي</p>
                <p className="text-2xl font-bold text-green-600">+{portfolioGrowth.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">عدد المشاريع</p>
                <p className="text-2xl font-bold">{uniqueProjects}</p>
              </div>
              <PieChart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>استثماراتك</CardTitle>
          <CardDescription>تتبع محفظتك الاستثمارية وأداء المشاريع</CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">لم تقم بأي استثمار بعد</p>
              <Link href="/projects">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                  تصفح المشاريع
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => {
                // Simulate current value (in real app, this would be based on project performance)
                const currentValue = investment.totalAmount * (1 + Math.random() * 0.3 - 0.1)
                const valueChange = ((currentValue - investment.totalAmount) / investment.totalAmount) * 100
                const isPositive = valueChange >= 0

                return (
                  <div key={investment.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{investment.projectTitle}</h3>
                          <Badge variant="secondary">{investment.projectCategory}</Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">الأسهم</p>
                            <p className="font-medium">{investment.shares}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المبلغ المستثمر</p>
                            <p className="font-medium">${investment.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">القيمة الحالية</p>
                            <p className="font-medium">${currentValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">العائد</p>
                            <p className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                              {isPositive ? "+" : ""}
                              {valueChange.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${investment.projectId}`}>
                          <button className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm hover:bg-secondary/80">
                            تفاصيل المشروع
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio allocation */}
      {investments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>توزيع المحفظة</CardTitle>
            <CardDescription>توزيع استثماراتك حسب فئات المشاريع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                investments.reduce(
                  (acc, inv) => {
                    acc[inv.projectCategory] = (acc[inv.projectCategory] || 0) + inv.totalAmount
                    return acc
                  },
                  {} as Record<string, number>,
                ),
              ).map(([category, amount]) => {
                const percentage = (amount / totalInvested) * 100
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{category}</span>
                      <span>
                        ${amount.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}