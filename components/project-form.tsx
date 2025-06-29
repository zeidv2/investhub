"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { createProject, updateProject } from "@/lib/firebase"
import type { Project } from "@/types"

interface ProjectFormProps {
  project?: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

/**
 * نموذج رفع/تعديل مشروع
 */
export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    category: project?.category || "",
    description: project?.description || "",
    fullDescription: project?.fullDescription || "",
    fundingGoal: project?.fundingGoal?.toString() || "",
    pricePerShare: project?.pricePerShare?.toString() || "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // التحقق من الحقول المطلوبة
      if (
        !formData.title ||
        !formData.category ||
        !formData.description ||
        !formData.fundingGoal ||
        !formData.pricePerShare
      ) {
        toast({
          title: "حقول مطلوبة",
          description: "يرجى تعبئة جميع الحقول الإلزامية.",
          variant: "destructive",
        })
        return
      }

      if (!user) {
        toast({
          title: "مطلوب تسجيل الدخول",
          description: "يرجى تسجيل الدخول لإنشاء مشروع.",
          variant: "destructive",
        })
        return
      }

      const payload = {
        ...formData,
        fundingGoal: Number(formData.fundingGoal),
        pricePerShare: Number(formData.pricePerShare),
        ownerId: user.uid,
        ownerName: user.displayName || "مالك مشروع",
      }

      let savedProject: Project

      if (project) {
        savedProject = await updateProject(project.id, payload)
        toast({
          title: "تم تحديث المشروع",
          description: "تم تعديل بيانات المشروع بنجاح.",
        })
      } else {
        savedProject = await createProject(payload)
        toast({
          title: "تم إنشاء المشروع",
          description: "تمت إضافة مشروعك بنجاح.",
        })
      }

      onSave(savedProject)
    } catch (error: any) {
      console.error("Project save error:", error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ المشروع.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* اسم المشروع */}
      <div>
        <Label htmlFor="title">اسم المشروع <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="أدخل اسم المشروع"
          required
          className="mt-1"
        />
      </div>

      {/* الفئة */}
      <div>
        <Label htmlFor="category">فئة المشروع <span className="text-destructive">*</span></Label>
        <Select
          value={formData.category}
          onValueChange={(value: string) => handleInputChange("category", value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="اختر الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="تقنية">تقنية</SelectItem>
            <SelectItem value="صحة">صحة</SelectItem>
            <SelectItem value="تعليم">تعليم</SelectItem>
            <SelectItem value="استدامة">استدامة</SelectItem>
            <SelectItem value="تجزئة">تجزئة</SelectItem>
            <SelectItem value="أخرى">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* وصف مختصر */}
      <div>
        <Label htmlFor="description">وصف مختصر <span className="text-destructive">*</span></Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="اكتب وصفًا موجزًا للمشروع (يظهر في قائمة المشاريع)"
          rows={2}
          required
          className="mt-1"
        />
      </div>

      {/* وصف تفصيلي */}
      <div>
        <Label htmlFor="fullDescription">الوصف التفصيلي</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) => handleInputChange("fullDescription", e.target.value)}
          placeholder="اكتب شرحًا كاملاً عن المشروع وفريق العمل والخطة"
          rows={4}
          className="mt-1"
        />
      </div>

      {/* هدف التمويل */}
      <div>
        <Label htmlFor="fundingGoal">هدف التمويل (بالدولار) <span className="text-destructive">*</span></Label>
        <Input
          id="fundingGoal"
          type="number"
          min="100"
          value={formData.fundingGoal}
          onChange={(e) => handleInputChange("fundingGoal", e.target.value)}
          placeholder="أدخل المبلغ المطلوب"
          required
          className="mt-1"
        />
      </div>

      {/* سعر السهم */}
      <div>
        <Label htmlFor="pricePerShare">سعر السهم الواحد (بالدولار) <span className="text-destructive">*</span></Label>
        <Input
          id="pricePerShare"
          type="number"
          min="1"
          value={formData.pricePerShare}
          onChange={(e) => handleInputChange("pricePerShare", e.target.value)}
          placeholder="أدخل سعر السهم"
          required
          className="mt-1"
        />
      </div>

      {/* أزرار الإجراء */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? "جاري الحفظ..."
            : project
              ? "حفظ التعديلات"
              : "رفع المشروع"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}