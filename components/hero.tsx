import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Shield } from "lucide-react"

/**
 * Hero Section Component
 * Main landing section explaining the platform's value proposition
 */
export function Hero() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            استثمر في المستقبل
          </h1>

          {/* Subheadline */}
<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
  تواصل مع مشاريع مبتكرة ورواد أعمال طموحين<br />
  ابنِ محفظتك الاستثمارية وادعم الأفكار الرائدة
</p>


          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                ابدأ الاستثمار
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                تصفح المشاريع
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">استثمارات ذكية</h3>
              <p className="text-sm text-muted-foreground">
                رؤى مبنية على البيانات لمساعدتك على اتخاذ قرارات استثمارية أفضل
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">مشاريع متنوعة</h3>
              <p className="text-sm text-muted-foreground">
                من شركات التقنية الناشئة إلى المبادرات المستدامة، اعثر على مشاريع تتوافق مع قيمك
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">منصة آمنة</h3>
              <p className="text-sm text-muted-foreground">
                أمان على مستوى البنوك وعمليات شفافة تحمي استثماراتك
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}