"use client"

import Link from "next/link"
import { useState } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { useSession, signOut } from "next-auth/react"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"
import { useUserAuth } from "@/hooks/use-user-auth"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation("common")
  const { data: session } = useSession()
  const { user } = useAuth()
  const { user: userData } = useUser()
  const { user: authUser, signOut: userSignOut } = useUserAuth()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    if (session) {
      await signOut()
    } else if (authUser) {
      await userSignOut()
    }
    router.push("/")
  }

  const currentUser = session || user || userData || authUser

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Photo Restore AI
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/restore"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Restore
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {currentUser.name || currentUser.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
