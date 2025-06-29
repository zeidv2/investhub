"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, userRole } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">InvestHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/projects" className="text-foreground hover:text-primary transition-colors">
              المشاريع
            </Link>

            {user ? (
              userRole ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">لوحة التحكم</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${userRole}`}>لوحتي</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-sm text-muted-foreground">جاري تحميل...</span>
              )
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">دخول</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>تسجيل جديد</Button>
                </Link>
              </div>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/projects"
              className="block px-4 py-2 text-foreground hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              المشاريع
            </Link>

            {user ? (
              userRole ? (
                <Link
                  href={`/dashboard/${userRole}`}
                  className="block px-4 py-2 text-foreground hover:bg-accent rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  لوحة التحكم
                </Link>
              ) : (
                <div className="block px-4 py-2 text-muted-foreground">جاري تحميل...</div>
              )
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-foreground hover:bg-accent rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  دخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2 text-foreground hover:bg-accent rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  تسجيل جديد
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
