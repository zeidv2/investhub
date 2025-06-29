import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

/**
 * Login Page
 * User authentication interface for existing users
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">مرحبًا بعودتك</CardTitle>
          <CardDescription>سجّل الدخول إلى حسابك في InvestHub</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Firebase authentication form */}
          <AuthForm mode="login" />
          <p className="text-center text-sm text-muted-foreground mt-4">
            ليس لديك حساب؟{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              سجّل الآن
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}