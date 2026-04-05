"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Home, UserSearch, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/paciente", label: "Ver Estudios", icon: UserSearch },
  { href: "/profesional", label: "Panel Profesional", icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-4 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* NAV CONTAINER */}
        <div className="flex items-center justify-between rounded-full border bg-primary/70 dark:bg-background/70 backdrop-blur-md shadow-md px-6 py-3">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              MediFiles
            </span>
          </Link>

          {/* NAV ITEMS */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-white hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

        </div>
      </div>
    </header>
  )
}