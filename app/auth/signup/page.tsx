import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

/**
 * Signup Page
 * User registration interface with role selection
 */
export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">انضم إلى InvestHub</CardTitle>
          <CardDescription>أنشئ حسابك وابدأ الاستثمار الآن</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Firebase authentication form with role selection */}
          <AuthForm mode="signup" />
          <p className="text-center text-sm text-muted-foreground mt-4">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              سجل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}