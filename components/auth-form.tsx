"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "signup"
}

/**
 * Authentication Form Component
 * Handles both login and signup with Firebase Authentication
 */
export function AuthForm({ mode }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "investor" as "investor" | "owner",
    displayName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "signup") {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "عدم تطابق كلمة المرور",
            description: "كلمتا المرور غير متطابقتين",
            variant: "destructive",
          })
          return
        }

        await signup(formData.email, formData.password, formData.role, formData.displayName)
        toast({
          title: "تم إنشاء الحساب",
          description: "مرحبًا بك في InvestHub! تم إنشاء حسابك بنجاح.",
        })
      } else {
        await login(formData.email, formData.password)
        toast({
          title: "مرحبًا بعودتك",
          description: "تم تسجيل دخولك بنجاح.",
        })
      }

      router.push("/")
    } catch (error: any) {
      console.error("Auth error:", error)
      toast({
        title: "خطأ في المصادقة",
        description: error.message || "حدث خطأ أثناء المصادقة",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display name for signup */}
      {mode === "signup" && (
        <div>
          <Label htmlFor="displayName">الاسم الكامل</Label>
          <Input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            placeholder="أدخل اسمك الكامل"
            required
            className="mt-1"
          />
        </div>
      )}

      {/* Email field */}
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="أدخل بريدك الإلكتروني"
          required
          className="mt-1"
        />
      </div>

      {/* Password field */}
      <div>
        <Label htmlFor="password">كلمة المرور</Label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="أدخل كلمة المرور"
            required
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Confirm password for signup */}
      {mode === "signup" && (
        <div>
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            placeholder="أعد كتابة كلمة المرور"
            required
            className="mt-1"
          />
        </div>
      )}

      {/* Role selection for signup */}
      {mode === "signup" && (
        <div>
          <Label htmlFor="role">نوع الحساب</Label>
          <Select
            value={formData.role}
            onValueChange={(value: "investor" | "owner") => handleInputChange("role", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="اختر نوع الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investor">
                <div className="flex flex-col items-start">
                  <span className="font-medium">مستثمر</span>
                  <span className="text-sm text-muted-foreground">استثمر في المشاريع وابنِ محفظتك</span>
                </div>
              </SelectItem>
              <SelectItem value="owner">
                <div className="flex flex-col items-start">
                  <span className="font-medium">مالك مشروع</span>
                  <span className="text-sm text-muted-foreground">أنشئ وادِر مشاريع استثمارية</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جاري المعالجة..." : mode === "signup" ? "إنشاء حساب" : "دخول"}
      </Button>
    </form>
  )
}