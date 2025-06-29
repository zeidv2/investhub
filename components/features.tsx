import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, TrendingUp, Users, Zap, Globe, Award } from "lucide-react"

/**
 * Features Section Component
 * Highlights key platform features and benefits
 */
export function Features() {
  const features = [
    {
      icon: Shield,
      title: "استثمارات آمنة",
      description:
        "أمان على مستوى البنوك مع معاملات مشفرة وحفظ بيانات آمن لحماية استثماراتك.",
    },
    {
      icon: TrendingUp,
      title: "تتبع المحفظة",
      description: "تتبع محفظتك الاستثمارية في الوقت الفعلي مع تحليلات مفصلة وأداء استثماري.",
    },
    {
      icon: Users,
      title: "مجتمع نشط",
      description: "تواصل مع مستثمرين ورواد أعمال في مجتمع متفاعل.",
    },
    {
      icon: Zap,
      title: "استثمار سريع",
      description: "عملية استثمار مبسطة تتيح لك الاستثمار في المشاريع بثوانٍ.",
    },
    {
      icon: Globe,
      title: "وصول عالمي",
      description: "فرص استثمارية من مختلف أنحاء العالم في منصة واحدة.",
    },
    {
      icon: Award,
      title: "مشاريع مدققة",
      description: "كل المشاريع تخضع لمراجعة دقيقة لضمان الجودة والشرعية.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">لماذا تختار InvestHub؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            منصتنا توفر لك كل ما تحتاج لاتخاذ قرارات استثمارية ذكية وتنمية محفظتك
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}