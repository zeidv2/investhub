import Link from "next/link"
import { TrendingUp } from "lucide-react"

/**
 * Footer Component
 * Site footer with links and company information
 */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">InvestHub</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              ربط المستثمرين بالمشاريع المبتكرة. ابنِ محفظتك وادعم الأفكار الرائدة.
            </p>
            <p className="text-sm text-muted-foreground">© 2025 InvestHub. جميع الحقوق محفوظة.</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">المنصة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  تصفح المشاريع
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  ابدأ الاستثمار
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  أنشئ مشروعك
                </Link>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  مركز المساعدة
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}